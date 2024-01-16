import sinon from 'sinon';
import MailerGateway from '../../src/application/gateway/MailerGateway';
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import Connection from '../../src/infra/database/Connection';
import RepositoryFactory from '../../src/application/factory/RepositoryFactory';
import RepositoryDatabaseFactory from '../../src/infra/factory/RepositoryDatabaseFactory';

let connection: Connection;
let repositoryFactory: RepositoryFactory;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(function () {
	connection = new PgPromiseAdapter();
	repositoryFactory = new RepositoryDatabaseFactory(connection);
	signup = new Signup(repositoryFactory);
  getAccount = new GetAccount(repositoryFactory);
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
  const output = await signup.execute(input);
  await getAccount.execute(output.accountId);
  expect(spy.calledOnce).toBeTruthy()
	expect(spy.calledWith(input.email, 'Verification')).toBeTruthy()
	spy.restore()
});

afterEach(async function () {
  await connection.close()
})