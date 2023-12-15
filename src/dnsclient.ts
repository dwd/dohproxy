import net from 'net';
import PromiseSocket from 'promise-socket';

export class DNSClient {
    socket: PromiseSocket<net.Socket> | undefined

    constructor(private ipAddress: string, private timeout: number) {
        this.socket = undefined;
    }

    timeout_fn() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout!'));
            }, this.timeout);
        });
    }

    async getSocket() {
        if (this.socket === undefined) {
            const net_socket = new net.Socket();
            this.socket = new PromiseSocket(net_socket);
            await this.socket.connect(53, this.ipAddress);
            const tmp = this.socket;
            this.socket.once('close').then(() => { console.log('Closed?'); this.closed(tmp); });
        }
        return this.socket;
    }

    closed(socket: PromiseSocket<net.Socket>) {
        if (this.socket === socket) {
            this.socket = undefined;
        }
    }

    async send_internal(query: Buffer) {
        const sock = await this.getSocket();
        const length = Buffer.alloc(2);
        length.writeUInt16BE(query.length);
        await sock.write(length);
        await sock.write(query);
        console.log(`Wrote ${query.length} octets to DNS server`);
        const answer_length = await sock.read(2);
        if (typeof answer_length !== 'object') throw Error('Unexpected failure'); // Buffer is an object
        if (answer_length?.length !== 2) throw Error('Bad response from DNS server');
        const l = answer_length.readUInt16BE();
        console.log(`Reading ${l} octets back`);
        const answer =  await sock.read(l);
        console.log(`Read ${answer?.length} octets back`);
        return answer;
    }

    send(query: Buffer) {
        return Promise.race([
            this.send_internal(query),
            this.timeout_fn()
        ])
    }
}