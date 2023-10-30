import HttpServer from '../http/HttpServer';
import inject from '../dependency-injection/Inject';
import Signup from '../../application/usecase/Signup';
import RequestRide from '../../application/usecase/RequestRide';
import GetRide from '../../application/usecase/GetRide';
import GetAccount from '../../application/usecase/GetAccount';

export default class MainController {
  @inject("signup")
  signup?: Signup;
  @inject("requestRide")
  requestRide?: RequestRide;
  @inject("getAccount")
  getAccount?: GetAccount;
  @inject("getRide")
  getRide?: GetRide;

  constructor(readonly httpServer: HttpServer) {
    httpServer.on('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup?.execute(body);
      return output;
    });

    httpServer.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide?.execute(body);
        return output;
      },
    );

    httpServer.on(
      'get',
      '/accounts/:accountId',
      async (params: any, body: any) => {
        const output = await this.getAccount?.execute(params.accountId);
        return output;
      },
    );

    httpServer.on(
      'get',
      '/rides/:rideId',
      async (params: any, body: any) => {
        const output = await this.getRide?.execute(params.rideId);
        return output;
      },
    );
  }
}
