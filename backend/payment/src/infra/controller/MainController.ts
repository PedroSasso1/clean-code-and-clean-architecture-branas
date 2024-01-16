import HttpServer from '../http/HttpServer';
import inject from '../dependency-injection/Inject';
import ProcessPayment from '../../application/usecase/Login';

export default class MainController {
  @inject('processPayment')
  processPayment?: ProcessPayment;


  constructor(readonly httpServer: HttpServer) {
    httpServer.on(
      'post',
      '/process_payment',
      async (params: any, body: any) => {
        const output = await this.processPayment?.execute(body);
        return output;
      },
    );
  }
}
