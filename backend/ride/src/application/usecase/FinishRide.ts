import PaymentGatewayHttp from '../../infra/gateway/PaymentGatewayHttp';
import AxiosAdapter from '../../infra/http/AxiosAdapter';
import Queue from '../../infra/queue/Queue';
import RabbitMQAdapter from '../../infra/queue/RabbitMQAdapter';
import RepositoryFactory from '../factory/RepositoryFactory';
import PaymentGateway from '../gateway/PaymentGateway';
import PositionRepository from '../repository/PositionRepository';
import RideRepository from '../repository/RideRepository';

export default class FinishRide {
  readonly rideRepository: RideRepository;
  readonly positionRepository: PositionRepository;
  
  constructor(
    readonly repositoryFactory: RepositoryFactory,
    readonly paymentGateway: PaymentGateway = new PaymentGatewayHttp(new AxiosAdapter()),
    readonly queue: Queue = new RabbitMQAdapter(),
  ) {
    this.rideRepository = repositoryFactory.createRideRepository();
    this.positionRepository = repositoryFactory.createPositionRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    const positions = await this.positionRepository.getByRideId(input.rideId);
    ride.finish(positions);
    await this.rideRepository.update(ride);
    await this.queue.publish('rideFinished', { rideId: ride.rideId, fare: ride.getFare() })
  }
}

type Input = {
  rideId: string;
}