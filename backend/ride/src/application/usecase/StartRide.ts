import RepositoryFactory from '../factory/RepositoryFactory';
import RideRepository from '../repository/RideRepository';

export default class StartRide {
  readonly rideRepository: RideRepository;

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = repositoryFactory.createRideRepository();
  }

  async execute(input: Input) {
    const ride = await this.rideRepository.getById(input.rideId);
    ride.start();
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
}