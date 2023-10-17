import PositionDAO from '../repository/PositionDAO';

export default class GetPosition {
  constructor(readonly positionDAO: PositionDAO) {}

  async execute(positionId: string) {
    const position = await this.positionDAO.getById(positionId);
    return position;
  }
}
