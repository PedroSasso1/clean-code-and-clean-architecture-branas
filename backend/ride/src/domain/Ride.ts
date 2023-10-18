import crypto from 'crypto';
import Coord from './Coord';
import Status, { StatusFactory } from './Status';

export default class Ride {
  driverId?: string;
  status?: Status;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    status: string,
    readonly date: Date,
    readonly from: Coord,
    readonly to: Coord,
  ) {
    this.status = StatusFactory.create(this, status);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const rideId = crypto.randomUUID();
    const status = 'requested';
    const date = new Date();
    return new Ride(
      rideId,
      passengerId,
      status,
      date,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
    );
  }

  static restore(
    rideId: string,
    passengerId: string,
    driverId: string,
    status: string,
    date: Date,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
  ) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      date,
      new Coord(fromLat, fromLong),
      new Coord(toLat, toLong),
    );
    ride.driverId = driverId;
    return ride;
  }

  accept(driverId: string) {
    this.driverId = driverId;
    this.status?.accept();
  }

  start() {
    this.status?.start();
  }

  finish() {
    this.status?.finish();
  }

  getStatus() {
    return this.status?.value;
  }
}
