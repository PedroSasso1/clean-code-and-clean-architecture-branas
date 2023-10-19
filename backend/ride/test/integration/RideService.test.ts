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
})

test('Deve solicitar uma corrida e receber a rideId', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
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
  expect(outputRequestRide.rideId).toBeDefined();
});

test('Deve solicitar uma corrida', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toBeDefined();
  expect(outputGetRide.status).toBe('requested');
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide.date).toBeDefined();
  expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat)
  expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long)
  expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat)
  expect(outputGetRide.toLong).toBe(inputRequestRide.to.long)
});

test('Deve solicitar uma corrida e aceitar uma corrida', async function () {
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test('Caso uma corrida seja solicitada por uma conta que não seja de passegeiro deve lançar um erro', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA9999',
    isDriver: true,
    isPassenger: false
  };
  const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.5849052557808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("Account is not from a passenger"))
});

test('Caso uma corrida seja solicitada por um passegeiro e ele ja tenha uma outra corrida em andamento deve lançar um erro', async function () {
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
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This passenger already has an active ride"))
});

test('Não deve aceitar uma corrida se account não for driver', async function () {
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
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error('Account is not from a driver'))
});

test('Não deve aceitar uma corrida se o status não for requested', async function () {
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
    isDriver: true,
    carPlate: 'AAA9999',
    isPassenger: false,
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  await expect(() => acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error('Invalid Status'))
});

test('Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento', async function () {
  const inputSignupPassenger1 = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const inputSignupPassenger2 = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    isDriver: false,
    carPlate: ''
  };
  const outputSignupPassenger1 = await signup.execute(inputSignupPassenger1);
  const outputSignupPassenger2 = await signup.execute(inputSignupPassenger2);
  const inputRequestRide1 = {
    passengerId: outputSignupPassenger1.accountId,
    from: {
      lat: -27.5849052557808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const inputRequestRide2 = {
    passengerId: outputSignupPassenger2.accountId,
    from: {
      lat: -27.5849052557808835,
      long: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      long: -48.522234807851476,
    },
  };
  const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
  const outputRequestRide2 = await requestRide.execute(inputRequestRide2);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isDriver: true,
    carPlate: 'AAA9999',
    isPassenger: false
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  }
  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide1);
  await expect(() => acceptRide.execute(inputAcceptRide2)).rejects.toThrow(new Error('Driver is already in another ride'))
});

test('Deve solicitar uma corrida, aceitar uma corrida e iniciar uma corrida', async function () {
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('in_progress');
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

afterEach(async function () {
  await connection.close()
})