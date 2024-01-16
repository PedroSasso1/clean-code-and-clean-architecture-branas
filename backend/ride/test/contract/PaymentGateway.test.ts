import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
import PaymentGatewayHttp from '../../src/infra/gateway/PaymentGatewayHttp';
test('Deve criar uma conta de passageiro', async function () {
  const httpClient = new AxiosAdapter()
  const paymentGateway = new PaymentGatewayHttp(httpClient);
  const inputProcessPayment = {
    rideId: '123456789',
    fare: 10,
  };
  const outputProcessPayment = await paymentGateway.process(inputProcessPayment);
  expect(outputProcessPayment.status).toBe('approved');
});
