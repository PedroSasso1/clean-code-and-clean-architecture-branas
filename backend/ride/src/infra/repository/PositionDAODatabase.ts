import PositionDAO from '../../application/repository/PositionDAO';
import Position from '../../domain/Position';
import Connection from '../database/Connection';

export default class PositionDAODatabase implements PositionDAO {
  constructor(readonly connection: Connection) {}
  
  async save(position: Position) {
    await this.connection.query(
      `insert into cccat13.position (position_id, ride_id, lat, long, date)
       values ($1, $2, $3, $4, $5)`,
      [
        position.positionId,
        position.rideId,
        position.lat,
        position.long,
        position.date,
      ],
    );
  }

  async getById(positionId: string): Promise<Position | undefined> {
    const [positionData] = await this.connection.query(
      'select * from cccat13.position where position_id = $1',
      [positionId],
    );
    if (!positionData) return;
    return Position.restore(
      positionData.position_id,
      positionData.ride_id,
      parseFloat(positionData.lat),
      parseFloat(positionData.long),
      positionData.date,
    );
  }
}
