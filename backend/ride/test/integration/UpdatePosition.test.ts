import AcceptRide from '../../src/application/usecase/AcceptRide';
import Connection from '../../src/infra/database/Connection';
import GetRide from '../../src/application/usecase/GetRide';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import RequestRide from '../../src/application/usecase/RequestRide';
import StartRide from '../../src/application/usecase/StartRide';
import UpdatePosition from '../../src/application/usecase/UpdatePosition';
import RepositoryFactory from '../../src/application/factory/RepositoryFactory';
import RepositoryDatabaseFactory from '../../src/infra/factory/RepositoryDatabaseFactory';
import AccountGateway from '../../src/application/gateway/AccountGateway';
import AccountGatewayHttp from '../../src/infra/gateway/AccountGatewayHttp';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';

let connection: Connection;
let repositoryFactory: RepositoryFactory;
let accountGateway: AccountGateway;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
let updatePosition: UpdatePosition;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  repositoryFactory = new RepositoryDatabaseFactory(connection);
  accountGateway = new AccountGatewayHttp(new AxiosAdapter());
  requestRide = new RequestRide(repositoryFactory, accountGateway);
  acceptRide = new AcceptRide(repositoryFactory, accountGateway);
  startRide= new StartRide(repositoryFactory);
  getRide = new GetRide(repositoryFactory, accountGateway);
  updatePosition = new UpdatePosition(repositoryFactory)
})
test('Deve solicitar, aceitar, iniciar e atualizar a posição de uma corrida', async function () {
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const outputSignupPassenger = await accountGateway.signup(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -27.5849052557808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA9999',
    isDriver: true,
    isPassenger: false
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = { rideId: outputRequestRide.rideId }
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.5849052557808835,
    long: -48.545022195325124
  }
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476
  }
  await updatePosition.execute(inputUpdatePosition2);
  const outputGetPositionsByRideId = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetPositionsByRideId.status).toBe('in_progress');
  expect(outputGetPositionsByRideId.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async function () {
  await connection.close()
})