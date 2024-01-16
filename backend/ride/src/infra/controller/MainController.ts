import HttpServer from '../http/HttpServer';
import inject from '../dependency-injection/Inject';
import RequestRide from '../../application/usecase/RequestRide';
import GetRide from '../../application/usecase/GetRide';

export default class MainController {
  @inject("requestRide")
  requestRide?: RequestRide;
  @inject("getRide")
  getRide?: GetRide;

  constructor(readonly httpServer: HttpServer) {
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
      '/rides/:rideId',
      async (params: any, body: any) => {
        const output = await this.getRide?.execute(params.rideId);
        return output;
      },
    );
  }
}
