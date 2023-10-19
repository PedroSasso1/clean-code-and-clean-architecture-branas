import RepositoryFactory from '../factory/RepositoryFactory';
import PositionRepository from '../repository/PositionRepository';
import RideRepository from '../repository/RideRepository';

export default class FinishRide {
  readonly rideRepository: RideRepository;
  readonly positionRepository: PositionRepository;
  
  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = repositoryFactory.createRideRepository();
    this.positionRepository = repositoryFactory.createPositionRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    const positions = await this.positionRepository.getByRideId(input.rideId);
    ride.finish(positions);
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
}