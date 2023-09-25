import crypto from 'crypto';

export default class Position {
  private constructor(
    readonly positionId: string,
    readonly rideId: string,
    readonly lat: number,
    readonly long: number,
    readonly date: Date,
  ) {}

  static create(rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID();
    const date = new Date();
    return new Position(positionId, rideId, lat, long, date);
  }

  static restore(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date,
  ) {
    return new Position(positionId, rideId, lat, long, date);
  }
}
