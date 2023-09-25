import crypto from 'crypto';

export default class Ride {
  driverId?: string;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
  ) {}

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
      fromLat,
      fromLong,
      toLat,
      toLong,
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
      fromLat,
      fromLong,
      toLat,
      toLong,
    );
    ride.driverId = driverId;
    return ride;
  }

  accept(driverId: string) {
    if (this.status !== 'requested')
      throw new Error('The ride is not requested');
    this.driverId = driverId;
    this.status = 'accepted';
  }

  getStatus() {
    return this.status;
  }
}
