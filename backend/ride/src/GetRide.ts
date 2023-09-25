import RideDAO from './RideDAO';
import RideDAODatabase from './RideDAODatabase';

export default class GetRide {
  constructor(readonly rideDAO: RideDAO = new RideDAODatabase()) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }
}
