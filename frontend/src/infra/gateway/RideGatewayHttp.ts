import RideGateway from "./RideGateway";
import HttpClient from "../http/HttpClient";
import Account from "../../domain/Account";

export default class RideGatewayHttp implements RideGateway {
  constructor(readonly httpClient: HttpClient) {}

  async signup(input: Account): Promise<any> {
    const output = await this.httpClient.post(
      "http://localhost:3003/signup",
      input
    );
    return output;
  }

  async getRide(rideId: string): Promise<Account> {
    const output = await this.httpClient.get(
      `http://localhost:3003/rides/${rideId}`
    );
    return output;
  }

  async getAccount(accountId: string): Promise<Account> {
    const output = await this.httpClient.get(
      `http://localhost:3003/account/${accountId}`
    );
    return output;
  }

  async requestRide(input: any): Promise<any> {
    const output = await this.httpClient.post(
      `http://localhost:3003/request_ride`,
      input
    );
    return output;
  }
}
