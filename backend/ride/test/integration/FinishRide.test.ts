import AcceptRide from '../../src/application/usecase/AcceptRide';
import Connection from '../../src/infra/database/Connection';
import GetRide from '../../src/application/usecase/GetRide';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import RequestRide from '../../src/application/usecase/RequestRide';
import Signup from '../../src/application/usecase/Signup';
import StartRide from '../../src/application/usecase/StartRide';
import UpdatePosition from '../../src/application/usecase/UpdatePosition';
import FinishRide from '../../src/application/usecase/FinishRide';
import RepositoryFactory from '../../src/application/factory/RepositoryFactory';
import RepositoryDatabaseFactory from '../../src/infra/factory/RepositoryDatabaseFactory';

let connection: Connection;
let repositoryFactory: RepositoryFactory;
let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  repositoryFactory = new RepositoryDatabaseFactory(connection);
  signup = new Signup(repositoryFactory);
  requestRide = new RequestRide(repositoryFactory);
  acceptRide = new AcceptRide(repositoryFactory);
  startRide= new StartRide(repositoryFactory);
  getRide = new GetRide(repositoryFactory);
  updatePosition = new UpdatePosition(repositoryFactory)
  finishRide = new FinishRide(repositoryFactory);
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
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
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
  const outputSignupDriver = await signup.execute(inputSignupDriver);
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
  const inputFinishRide = {
    rideId: outputRequestRide.rideId
  }
  await finishRide.execute(inputFinishRide);
  const outputGetRideId = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRideId.status).toBe('completed');
  expect(outputGetRideId.distance).toBe(10);
  expect(outputGetRideId.fare).toBe(21);
});

afterEach(async function () {
  await connection.close()
})