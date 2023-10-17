import { mount } from "@vue/test-utils";
import SignupVue from "../../src/view/SignupView.vue";
import RideGatewayHttp from "../../src/infra/gateway/RideGatewayHttp";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

test("Deve criar um passageiro", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John Doe");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
  wrapper.get(".signup-cpf").setValue("95818705552");
  wrapper.get(".signup-is-passenger").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});

test("Não deve criar um passageiro se o cpf estiver invalido", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John Doe");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
  wrapper.get(".signup-cpf").setValue("1111111111");
  wrapper.get(".signup-is-passenger").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-error").text()).toBe("Invalid cpf");
});

test("Não deve criar um passageiro se o nome estiver invalido", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
  wrapper.get(".signup-cpf").setValue("95818705552");
  wrapper.get(".signup-is-passenger").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-error").text()).toBe("Invalid name");
});

test("Não deve criar um passageiro se o email estiver invalido", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John Doe");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}`);
  wrapper.get(".signup-cpf").setValue("95818705552");
  wrapper.get(".signup-is-passenger").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-error").text()).toBe("Invalid email");
});

test("Não deve criar um passageiro se o email estiver duplicado", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John Doe");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
  wrapper.get(".signup-cpf").setValue("95818705552");
  wrapper.get(".signup-is-passenger").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-error").text()).toBe("Account already exists");
});

test("Deve criar um motorista", async function () {
  const wrapper = mount(SignupVue, {
    global: {
      provide: { rideGateway: new RideGatewayHttp(new AxiosAdapter()) },
    },
  });
  expect(wrapper.get(".signup-title").text()).toBe("Signup");
  wrapper.get(".signup-name").setValue("John Doe");
  wrapper.get(".signup-email").setValue(`john.doe${Math.random()}@gmail.com`);
  wrapper.get(".signup-cpf").setValue("95818705552");
  wrapper.get(".signup-car-plate").setValue("AAA9999");
  wrapper.get(".signup-is-driver").setValue(true);
  await wrapper.get(".signup-submit").trigger("click");
  await sleep(200);
  expect(wrapper.get(".signup-account-id").text()).toHaveLength(36);
});
