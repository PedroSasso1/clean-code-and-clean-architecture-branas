import ProcessPayment from '../../application/usecase/Login';
import inject from '../dependency-injection/Inject';
import Queue from '../queue/Queue';

export default class QueueController {
  @inject('processPayment')
  processPayment?: ProcessPayment;

  constructor(private readonly queue: Queue) {
    queue.consume('rideFinished', async (input: any) => {
      await this.processPayment?.execute(input); 
    })
  }
}
