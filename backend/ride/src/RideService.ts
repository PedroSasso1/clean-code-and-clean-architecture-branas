import RideDAO from './RideDAO';
import RideDAODatabase from './RideDAODatabase';
import AccountDAO from './AccountDAO';
import AccountDAODatabase from './AccountDAODatabase';
import Ride from './Ride';

export default class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {}

  async requestRide(input: any) {
    const account = await this.accountDAO.getById(input.passengerId);
    if(!account?.isPassenger) throw new Error('Account is not from a passenger')
    const activeRides = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId);
    if(activeRides.length > 0) throw new Error('This passenger already has an active ride');
    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideDAO.save(ride);
    return { rideId: ride.rideId };
  }

  async acceptRide(input: any) {
    const account = await this.accountDAO.getById(input.driverId);
    if(!account?.isDriver) throw new Error('Account is not from a driver')
    const ride = await this.getRide(input.rideId);
    ride.accept(input.driverId);
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(input.driverId)
    if(activeRides.length > 0) throw new Error('Driver is already in another ride')
    await this.rideDAO.update(ride);
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }
}
