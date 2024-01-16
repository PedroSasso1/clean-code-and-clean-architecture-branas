import HttpServer from './HttpServer';
import express, { Request, Response } from 'express';
import cors from 'cors';

export default class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        console.log(req.body);
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        res.status(422).json({ message: error.message });
      }
    });
  }

  listen(port: number): void {
    this.app.listen(port);
  }
}