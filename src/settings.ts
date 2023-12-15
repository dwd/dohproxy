interface Settings {
    dns_servers: string[]
    timeout: number
}

function settings(): Settings {
    if (!process.env.DOH_DNS_SERVERS) {
        throw new Error('DOH_DNS_SERVERS environment variable is not set')
    }
    return {
        dns_servers: process.env.DOH_DNS_SERVERS.split(','),
        timeout: Number(process.env.DOH_TIMEOUT || '200'),
    }
}

export default settings;
