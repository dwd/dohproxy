import {DNSClient} from "./dnsclient";
import settings from "./settings";

export class DNSPool {
    dns_client_pool: DNSClient[];

    constructor() {
        this.dns_client_pool = [];
    }

    /**
     * Creates a new DNS client.
     *
     * @return {DNSClient} A new instance of DNSClient.
     */
    new_client() {
        const s = settings();
        const which = Math.floor(Math.random() * s.dns_servers.length);
        return new DNSClient(s.dns_servers[which], s.timeout);
    }

    async send(query: Buffer) {
        let err;
        for (let i = 0; i!= 5; ++i) {
            const mine = this.dns_client_pool.pop() || this.new_client();
            try {
                return await  mine.send(query);
            } catch(e) {
                err = e
            } finally {
                this.dns_client_pool.push(mine);
            }
        }
        throw err || new Error('Unexpected logic failure');
    }

    /**
     * Performs a health check by sending DNS queries to the configured DNS servers.
     *
     * @returns {Promise<Record<string, boolean>>} A promise that resolves to an object containing the status of each DNS server and an overall summary.
     */
    async healthcheck(): Promise<Record<string, boolean>> {
        const s = settings();
        const clients = s.dns_servers.map((dns_server) => new DNSClient(dns_server, s.timeout));
        const queries = clients.map((c) => c.send(Buffer.from('HSMBIAABAAAAAAABBmdvb2dsZQJjbwJ1awAAAQABAAApBNAAAAAAAAwACgAIVc70BPydLBY', 'base64url')));
        const result = await Promise.allSettled(queries);
        const status =  s.dns_servers.reduce((acc, cur, idx) => {
            acc[cur] = result[idx].status === 'fulfilled';
            return acc;
        }, {} as Record<string, boolean>);
        const overall = Object.keys(status).reduce((acc, cur) => acc && status[cur], true);
        return {
            ...status,
            summary: overall,
        }
    }
}
