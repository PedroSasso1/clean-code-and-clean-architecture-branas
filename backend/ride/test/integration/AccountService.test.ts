import AccountRepository from '../../src/infra/repository/AccountRepositoryDatabase';
import sinon from 'sinon';
import MailerGateway from '../../src/application/gateway/MailerGateway';
import AccountRepositoryMemory from '../../src/infra/repository/AccountRepositoryMemory';
import Account from '../../src/domain/Account';
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import AccountRepositoryDatabase from '../../src/infra/repository/AccountRepositoryDatabase';
import Connection from '../../src/infra/database/Connection';

let connection: Connection;
let accountRepository: AccountRepository;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(function () {
	connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
	signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);
})

test('Deve criar um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
		isDriver: false,
		carPlate: ''
  };
  const output = await signup.execute(input);
  const account = await getAccount.execute(output.accountId);
  expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true,
		isDriver: false,
		carPlate: ''
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ''
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ''
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
		isDriver: false,
		carPlate: ''
	}
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true,
		isPassenger: false,
	}
	const output = await signup.execute(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true,
		isPassenger: false,
	}
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid plate"));
});

test('Deve criar um passageiro com stub', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
		isDriver: false,
		carPlate: ''
  };
  const saveStub = sinon.stub(AccountRepository.prototype, 'save').resolves();
  const getByEmailStub = sinon.stub(AccountRepository.prototype, 'getByEmail').resolves();
  const output = await signup.execute(input);
  const getByIdStub = sinon.stub(AccountRepository.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  const account = await getAccount.execute(output.accountId);
  expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
	saveStub.restore();
	getByEmailStub.restore();
	getByIdStub.restore();
});

test('Deve criar um passageiro com spy', async function () {
	const spy = sinon.spy(MailerGateway.prototype, 'send')
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
		isDriver: false,
		carPlate: ''
  };
  const saveStub = sinon.stub(AccountRepository.prototype, 'save').resolves();
  const getByEmailStub = sinon.stub(AccountRepository.prototype, 'getByEmail').resolves();
  const output = await signup.execute(input);
  const getByIdStub = sinon.stub(AccountRepository.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  await getAccount.execute(output.accountId);
  expect(spy.calledOnce).toBeTruthy()
	expect(spy.calledWith(input.email, 'Verification')).toBeTruthy()
	spy.restore()
	saveStub.restore()
	getByEmailStub.restore()
	getByIdStub.restore()
});

test('Deve criar um passageiro com spy', async function () {
	const input = {
		name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
		isDriver: false,
		carPlate: ''
  };
	const mailerMock = sinon.mock(MailerGateway.prototype)
	mailerMock.expects("send").withArgs(input.email, "Verification").calledOnce;
	const accountDAOMock = sinon.mock(AccountRepository.prototype)
	accountDAOMock.expects('save').resolves()
	accountDAOMock.expects('getByEmail').resolves()
  const output = await signup.execute(input);
  const getByIdStub = sinon.stub(AccountRepository.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  await getAccount.execute(output.accountId);
	mailerMock.verify()
	accountDAOMock.verify()
	mailerMock.restore()
	accountDAOMock.restore()
	getByIdStub.restore()
});

test('Deve criar um passageiro com fake', async function () {
	const accountDAO = new AccountRepositoryMemory();
	signup = new Signup(accountDAO);
	getAccount = new GetAccount(accountDAO);
	const input: any = {
		name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const output = await signup.execute(input);
  const account = await getAccount.execute(output.accountId);
	expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
});

afterEach(async function () {
  await connection.close()
})