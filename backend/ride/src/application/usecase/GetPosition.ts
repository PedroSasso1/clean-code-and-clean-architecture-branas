import PositionDAO from '../repository/PositionDAO';

export default class GetRide {
  constructor(readonly positionDAO: PositionDAO) {}

  async execute(positionId: string) {
    const position = await this.positionDAO.getById(positionId);
    return position;
  }
}
