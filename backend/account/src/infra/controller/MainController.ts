import HttpServer from '../http/HttpServer';
import inject from '../dependency-injection/Inject';
import Signup from '../../application/usecase/Signup';
import GetAccount from '../../application/usecase/GetAccount';

export default class MainController {
  @inject("signup")
  signup?: Signup;
  
  @inject("getAccount")
  getAccount?: GetAccount;
  

  constructor(readonly httpServer: HttpServer) {
    httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup?.execute(body);
      return output;
    });

    httpServer.on(
      'get',
      '/accounts/:accountId',
      async (params: any, body: any) => {
        const output = await this.getAccount?.execute(params.accountId);
        return output;
      },
    );
  }
}
