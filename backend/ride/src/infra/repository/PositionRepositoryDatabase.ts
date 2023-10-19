import PositionRepository from '../../application/repository/PositionRepository';
import Position from '../../domain/Position';
import Connection from '../database/Connection';

export default class PositionRepositoryDatabase implements PositionRepository {
  constructor(readonly connection: Connection) {}
  
  async save(position: Position) {
    await this.connection.query(
      `insert into cccat13.position (position_id, ride_id, lat, long, date)
       values ($1, $2, $3, $4, $5)`,
      [
        position.positionId,
        position.rideId,
        position.coord.getLat(),
        position.coord.getLong(),
        position.date,
      ],
    );
  }

  async getByRideId(rideId: string): Promise<Position[]> {
    const positionsData = await this.connection.query(
      'select * from cccat13.position where ride_id = $1',
      [rideId],
    );
    const positions = []
    for(const positionData of positionsData) {
      positions.push(
        Position.restore(
         positionData.position_id,
         positionData.ride_id,
         parseFloat(positionData.lat),
         parseFloat(positionData.long),
         positionData.date,
       )
      )
    }
    return positions;
  }
}
