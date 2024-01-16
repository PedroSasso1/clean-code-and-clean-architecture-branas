import HttpServer from '../http/HttpServer';
import inject from '../dependency-injection/Inject';
import RequestRide from '../../application/usecase/RequestRide';
import GetRide from '../../application/usecase/GetRide';
import Queue from '../queue/Queue';

export default class MainController {
  @inject("requestRide")
  requestRide?: RequestRide;
  @inject("getRide")
  getRide?: GetRide;
  @inject("httpServer")
  httpServer?: HttpServer;
  @inject("queue")
  queue?: Queue;

  constructor() {
    this.httpServer?.on(
      'post',
      '/request_ride',
      async (params: any, body: any) => {
        const output = await this.requestRide?.execute(body);
        return output;
      },
    );

    // command handler - tempo de processamento (SLA), resiliente
    this.httpServer?.on(
      'post',
      '/request_ride_async',
      async (params: any, body: any) => {
        await this.queue?.publish('requestRide', body);
      },
    )

    this.httpServer?.on(
      'get',
      '/rides/:rideId',
      async (params: any, body: any) => {
        const output = await this.getRide?.execute(params.rideId);
        return output;
      },
    );
  }
}
