import RideRepository from '../../application/repository/RideRepository';
import Ride from '../../domain/Ride';
import Connection from '../database/Connection';

export default class RideRepositoryDatabase implements RideRepository {
  constructor(readonly connection: Connection) {}

  async save(ride: Ride) {
    await this.connection.query(
      `insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        ride.rideId,
        ride.passengerId,
        ride.from.getLat(),
        ride.from.getLong(),
        ride.to.getLat(),
        ride.to.getLong(),
        ride.getStatus(),
        ride.date,
      ],
    );
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      `update cccat13.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5`,
      [ride.driverId, ride.getStatus(), ride.getDistance(), ride.getFare(), ride.rideId],
    );
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query(
      `select * from cccat13.ride where ride_id = $1`,
      [rideId],
    );
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      rideData.date,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      parseFloat(rideData.distance),
      parseFloat(rideData.fare)
    );
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const rideData = await this.connection.query(
      `select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')`,
      [passengerId],
    );
    return rideData;
  }

  async getActiveRidesByDriverId(driverId: string): Promise<any> {
    const rideData = await this.connection.query(
      `select * from cccat13.ride where driver_id = $1 and status in ('accepted', 'in_progress')`,
      [driverId],
    );
    return rideData;
  }
}