import AccountDAO from '../repository/AccountDAO';
import RideDAO from '../repository/RideDAO';

export default class GetRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO,
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideDAO.getById(rideId);
    const account = await this.accountDAO.getById(ride.passengerId);
    if (!ride || !account) throw new Error();
    return {
      rideId: ride.rideId,
      passengerId: ride.passengerId,
      driverId: ride.driverId,
      fromLat: ride.from.getLat(),
      fromLong: ride.from.getLong(),
      toLat: ride.to.getLat(),
      toLong: ride.to.getLong(),
      date: ride.date,
      status: ride.getStatus(),
      passenger: {
        accountId: account.accountId,
        name: account.name.getValue(),
        email: account.email.getValue(),
        cpf: account.cpf.getValue(),
        carPlate: account.carPlate.getValue(),
        isPassenger: account.isPassenger,
        isDriver: account.isDriver,
      },
    };
  }
}

type Output = {
  rideId: string,
  passengerId: string,
  driverId: string | undefined,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  date: Date,
  status: string | undefined,
  passenger: {
    accountId: string;
    name: string;
    email: string;
    cpf: string;
    carPlate: string;
    isPassenger: boolean;
    isDriver: boolean;
  }
}