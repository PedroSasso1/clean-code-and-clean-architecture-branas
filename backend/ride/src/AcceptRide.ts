import RideDAO from './RideDAO';
import RideDAODatabase from './RideDAODatabase';
import AccountDAO from './AccountDAO';
import AccountDAODatabase from './AccountDAODatabase';

export default class AcceptRide {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {}

  async execute(input: Input) {
    const account = await this.accountDAO.getById(input.driverId);
    if(!account?.isDriver) throw new Error('Account is not from a driver')
    const ride = await this.rideDAO.getById(input.rideId);
    ride.accept(input.driverId);
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(input.driverId)
    if(activeRides.length > 0) throw new Error('Driver is already in another ride')
    await this.rideDAO.update(ride);
  }
}

type Input = {
  rideId: string,
  driverId: string,
}