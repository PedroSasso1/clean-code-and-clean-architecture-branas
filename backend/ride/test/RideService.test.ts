import AccountService from '../src/AccountService';
import RideService from '../src/RideService';

test('Deve solicitar uma corrida e receber a rideId', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const accountService = new AccountService();
  const outputSignup = await accountService.signup(inputSignup);
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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
});

test('Deve solicitar uma corrida', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const accountService = new AccountService();
  const outputSignup = await accountService.signup(inputSignup);
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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
  expect(outputGetRide.ride_id).toBeDefined();
  expect(outputGetRide.status).toBe('requested');
  expect(outputGetRide.passenger_id).toBe(outputSignup.accountId);
  expect(outputGetRide.date).toBeDefined();
  expect(parseFloat(outputGetRide.from_lat)).toBe(inputRequestRide.from.lat)
  expect(parseFloat(outputGetRide.from_long)).toBe(inputRequestRide.from.long)
  expect(parseFloat(outputGetRide.to_lat)).toBe(inputRequestRide.to.lat)
  expect(parseFloat(outputGetRide.to_long)).toBe(inputRequestRide.to.long)
});

test('Deve solicitar uma corrida e aceitar uma corrida', async function () {
  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide);
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
});

test('Caso uma corrida seja solicitada por uma conta que não seja de passegeiro deve lançar um erro', async function () {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const accountService = new AccountService();
  const outputSignup = await accountService.signup(inputSignup);
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
  const rideService = new RideService();
  await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error("Account is not from a passenger"))
});

test('Caso uma corrida seja solicitada por um passegeiro e ele ja tenha uma outra corrida em andamento deve lançar um erro', async function () {
  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
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
  const rideService = new RideService();
  await rideService.requestRide(inputRequestRide);
  await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error("This passenger already has an active ride"))
});

test('Não deve aceitar uma corrida se account não for driver', async function () {
  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow(new Error('Account is not from a driver'))
});

test('Não deve aceitar uma corrida se o status não for requested', async function () {
  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isDriver: true,
    carPlate: 'AAA9999'
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide)
  await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow(new Error('The ride is not requested'))
});

test('Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento', async function () {
  const accountService = new AccountService();
  const inputSignupPassenger1 = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const inputSignupPassenger2 = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const outputSignupPassenger1 = await accountService.signup(inputSignupPassenger1);
  const outputSignupPassenger2 = await accountService.signup(inputSignupPassenger2);
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
  const rideService = new RideService();
  const outputRequestRide1 = await rideService.requestRide(inputRequestRide1);
  const outputRequestRide2 = await rideService.requestRide(inputRequestRide2);
  const inputSignupDriver = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isDriver: true,
    carPlate: 'AAA9999'
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);
  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  }
  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide1);
  await expect(() => rideService.acceptRide(inputAcceptRide2)).rejects.toThrow(new Error('Driver is already in another ride'))
});