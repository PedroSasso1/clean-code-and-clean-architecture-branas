import RepositoryFactory from '../factory/RepositoryFactory';
import AccountGateway from '../gateway/AccountGateway';
import RideRepository from '../repository/RideRepository';

export default class GetRide {
  readonly rideRepository: RideRepository;
  
  constructor(readonly repositoryFactory: RepositoryFactory, readonly accountGateway: AccountGateway) {
    this.rideRepository = repositoryFactory.createRideRepository();
  }

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getById(rideId);
    const account = await this.accountGateway.getById(ride.passengerId);
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
      fare: ride.getFare(),
      distance: ride.getDistance(),
      passenger: {
        accountId: account.accountId,
        name: account.name,
        email: account.email,
        cpf: account.cpf,
        carPlate: account.carPlate,
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
  status: string,
  fare: number,
  distance: number,
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