import AccountDAO from '../repository/AccountDAO';
import RideDAO from '../repository/RideDAO';

export default class GetRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    const account = await this.accountDAO.getById(ride.passengerId);
    return Object.assign(ride, { passenger: account });
  }
}
