import RideRepository from '../repository/RideRepository';
import AccountRepository from '../repository/AccountRepository';
import RepositoryFactory from '../factory/RepositoryFactory';

export default class AcceptRide {
  readonly rideRepository: RideRepository;
  readonly accountRepository: AccountRepository;
  
  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.rideRepository = repositoryFactory.createRideRepository()
    this.accountRepository = repositoryFactory.createAccountRepository()
  }

  async execute(input: Input) {
    const account = await this.accountRepository.getById(input.driverId);
    if (!account?.isDriver) throw new Error('Account is not from a driver');
    const ride = await this.rideRepository.getById(input.rideId);
    ride.accept(input.driverId);
    const activeRides = await this.rideRepository.getActiveRidesByDriverId(
      input.driverId,
    );
    if (activeRides.length > 0)
      throw new Error('Driver is already in another ride');
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string,
}