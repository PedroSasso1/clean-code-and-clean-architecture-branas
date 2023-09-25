import Position from '../../domain/Position';

export default interface PositionDAO {
  save(position: Position): Promise<void>;
  getById(positionId: string): Promise<Position | undefined>;
}
