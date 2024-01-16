import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
test('Deve criar uma conta de passageiro', async function () {
  const httpClient = new AxiosAdapter()
  const accountGateway = new AccountGatewayHttp(httpClient);
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const outputGetAccount = await accountGateway.getById(outputSignup.accountId);
  expect(outputGetAccount.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  expect(outputGetAccount.cpf).toBe(inputSignup.cpf);
});
