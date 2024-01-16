import RequestRide from '../../application/usecase/RequestRide';
import inject from '../dependency-injection/Inject';
import Queue from '../queue/Queue';

export default class QueueController {
  @inject('requestRide')
  requestRide?: RequestRide;
  @inject('queue')
  queue?: Queue;

  constructor() {
    this.queue?.consume('requestRide', async (input: any) => {
      await this.requestRide?.execute(input);
    });
  }
}
