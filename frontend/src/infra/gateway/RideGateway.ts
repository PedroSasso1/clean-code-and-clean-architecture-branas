import Account from "../../domain/Account";

export default interface RideGateway {
  signup(input: Account): Promise<any>;
  requestRide(input: any): Promise<any>;
  getAccount(accountId: string): Promise<Account>;
  getRide(rideId: string): Promise<any>;
}
