import express, { Express, Request, Response , Application } from 'express';
import dnsquery from './dnsquery';
import winston from 'winston';
import {DNSPool} from "./pool";

const app = express();
const port = process.env.PORT || 8000;
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

app.use((req, res, next) =>{
    logger.log('info', `${req.method} ${req.path} -->`);
    next();
    logger.log('info', `${req.method} ${req.path} --> ${req.statusCode}`);
});

app.get('/', (req: Request, res: Response) => {
  res.json({
      status: 'OK',
  });
});

app.use('/dns-query', dnsquery);

app.get('/healthcheck', async (req, res) => {
    const tmp_pool = new DNSPool();
    const result = await tmp_pool.healthcheck();
    res.status(200).json(result);
})

app.listen(port, () => {
  console.log(`DoH Proxy is listening at http://localhost:${port}`);
});
