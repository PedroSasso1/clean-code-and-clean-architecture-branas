import RideRepository from '../repository/RideRepository';
import AccountRepository from '../repository/AccountRepository';

export default class AcceptRide {
  constructor(
    readonly rideRepository: RideRepository,
    readonly accountRepository: AccountRepository,
  ) {}

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