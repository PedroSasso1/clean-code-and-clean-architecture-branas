import AcceptRide from '../../src/application/usecase/AcceptRide';
import AccountRepository from '../../src/application/repository/AccountRepository';
import AccountRepositoryDatabase from '../../src/infra/repository/AccountRepositoryDatabase';
import Connection from '../../src/infra/database/Connection';
import GetRide from '../../src/application/usecase/GetRide';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import RequestRide from '../../src/application/usecase/RequestRide';
import RideRepository from '../../src/application/repository/RideRepository';
import RideRepositoryDatabase from '../../src/infra/repository/RideRepositoryDatabase';
import Signup from '../../src/application/usecase/Signup';
import StartRide from '../../src/application/usecase/StartRide';
import UpdatePosition from '../../src/application/usecase/UpdatePosition';
import PositionRepository from '../../src/application/repository/PositionRepository';
import PositionRepositoryDatabase from '../../src/infra/repository/PositionRepositoryDatabase';
import FinishRide from '../../src/application/usecase/FinishRide';

let connection: Connection;
let accountRepository: AccountRepository;
let rideRepository: RideRepository;
let signup: Signup;
let requestRide: RequestRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let getRide: GetRide;
let positionRepository: PositionRepository;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
  rideRepository = new RideRepositoryDatabase(connection);
  positionRepository = new PositionRepositoryDatabase(connection);
  signup = new Signup(accountRepository);
  requestRide = new RequestRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  startRide= new StartRide(rideRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  updatePosition = new UpdatePosition(positionRepository, rideRepository)
  finishRide = new FinishRide(rideRepository, positionRepository);
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