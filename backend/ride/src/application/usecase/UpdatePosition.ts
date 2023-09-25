import Position from '../../domain/Position';
import PositionDAO from '../repository/PositionDAO';
import RideDAO from '../repository/RideDAO';
import crypto from 'crypto';

export default class UpdatePosition {
  constructor(
    readonly positionDAO: PositionDAO,
    readonly rideDAO: RideDAO,
  ) {}

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId);
    if (ride.getStatus() !== 'in_progress')
      throw new Error('The ride is not in_progress');
    const position = Position.create(input.rideId, input.lat, input.long);
    await this.positionDAO.save(position)
    return { positionId: position.positionId };
  }
}

type Input = {
  rideId: string;
  lat: number;
  long: number;
}
