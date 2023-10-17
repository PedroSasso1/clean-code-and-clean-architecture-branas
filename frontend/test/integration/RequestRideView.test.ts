import { mount } from "@vue/test-utils";
import SignupView from "../../src/view/SignupView.vue";
import RequestRideView from "../../src/view/RequestRideView.vue";
import GetRideView from "../../src/view/GetRideView.vue";
import RideGatewayHttp from "../../src/infra/gateway/RideGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import GeolocationGateway from "../../src/infra/gateway/GeolocationGateway";

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

test("Deve solicitar um passageiro", async function () {
  const wrapperSignupView = mount(SignupView, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  wrapperSignupView.get(".signup-name").setValue("John Doe");
  wrapperSignupView
    .get(".signup-email")
    .setValue(`john.doe${Math.random()}@gmail.com`);
  wrapperSignupView.get(".signup-cpf").setValue("95818705552");
  wrapperSignupView.get(".signup-is-passenger").setValue(true);
  await wrapperSignupView.get(".signup-submit").trigger("click");
  await sleep(200);
  const accountId = wrapperSignupView.get(".signup-account-id").text();
  const geolocationGateway: GeolocationGateway = {
    async getGeolocation() {
      return {
        lat: -27.496887588317275,
        long: -48.522234807851476,
      };
    },
  };
  const wrapperRequestRideView = mount(RequestRideView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new AxiosAdapter()),
        geolocationGateway: geolocationGateway,
      },
    },
  });
  expect(wrapperRequestRideView.get(".request-ride-title").text()).toBe(
    "Request Ride"
  );
  wrapperRequestRideView.get(".request-ride-passenger-id").setValue(accountId);
  wrapperRequestRideView
    .get(".request-ride-to-lat")
    .setValue(-27.496887588317275);
  wrapperRequestRideView
    .get(".request-ride-to-long")
    .setValue(-48.522234807851476);
  wrapperRequestRideView
    .get(".request-ride-from-lat")
    .setValue(-27.5849052557808835);
  wrapperRequestRideView
    .get(".request-ride-from-long")
    .setValue(-48.545022195325124);
  await wrapperRequestRideView.get(".request-ride-submit").trigger("click");
  await sleep(200);
  const rideId = wrapperRequestRideView.get(".request-ride-ride-id").text();
  const wrapperGetRideView = mount(GetRideView, {
    global: {
      provide: {
        rideGateway: new RideGatewayHttp(new AxiosAdapter()),
      },
    },
  });
  wrapperGetRideView.get(".get-ride-ride-id").setValue(rideId);
  await wrapperGetRideView.get(".get-ride-submit").trigger("click");
  await sleep(200);
  expect(wrapperGetRideView.get(".get-ride-passenger-name").text()).toBe(
    "John Doe"
  );
  expect(wrapperGetRideView.get(".get-ride-status").text()).toBe("requested");
});
