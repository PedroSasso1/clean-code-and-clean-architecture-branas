import RideDAO from '../repository/RideDAO';

export default class GetRide {
  constructor(readonly rideDAO: RideDAO) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }
}
