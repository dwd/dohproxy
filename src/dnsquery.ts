import {NextFunction, Request, Response, Router} from "express";
import {raw} from 'body-parser';
import {DNSPool} from "./pool";

const router = Router();

router.use(raw({
    limit: '50kb',
    type: ['application/dns-message'],
}));

const dnsclient = new DNSPool();

router.get('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.query);
        const dns = req.query.dns;
        if (typeof dns !== 'string') throw new Error('Wrong type for query argument');
        const query = Buffer.from(dns, 'base64url')
        console.log('GET Query length: ', query.length)
        const answer = await dnsclient.send(query);
        res.status(200).contentType('application/dns-message').send(answer)
    } catch (err) {
        next(err);
    }
});

router.post('', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query: Buffer = req.body;
        console.log('POST Query length: ', query.length)
        const answer = await dnsclient.send(query);
        res.status(200).contentType('application/dns-message').send(answer)
    } catch (err) {
        next(err);
    }
});

export default router;