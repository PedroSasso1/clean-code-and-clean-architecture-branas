import Ride from './Ride';

export default interface RideDAO {
  save(ride: Ride): Promise<void>;
  update(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
}
