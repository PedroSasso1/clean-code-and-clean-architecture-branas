import AccountDAO from '../src/AccountDAODatabase';
import AccountService from '../src/AccountService';
import sinon from 'sinon';
import MailerGateway from '../src/MailerGateway';
import AccountDAOMemory from '../src/AccountDAOMemory';
import Account from '../src/Account';
test('Deve criar um passageiro', async function () {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const account = await accountService.getAccount(output.accountId);
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
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const accountService = new AccountService();
	await accountService.signup(input)
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid plate"));
});

test('Deve criar um passageiro com stub', async function () {
  const input: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const saveStub = sinon.stub(AccountDAO.prototype, 'save').resolves();
  const getByEmailStub = sinon.stub(AccountDAO.prototype, 'getByEmail').resolves();
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const getByIdStub = sinon.stub(AccountDAO.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  const account = await accountService.getAccount(output.accountId);
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
  const input: any = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const saveStub = sinon.stub(AccountDAO.prototype, 'save').resolves();
  const getByEmailStub = sinon.stub(AccountDAO.prototype, 'getByEmail').resolves();
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const getByIdStub = sinon.stub(AccountDAO.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  await accountService.getAccount(output.accountId);
  expect(spy.calledOnce).toBeTruthy()
	expect(spy.calledWith(input.email, 'Verification')).toBeTruthy()
	spy.restore()
	saveStub.restore()
	getByEmailStub.restore()
	getByIdStub.restore()
});

test('Deve criar um passageiro com spy', async function () {
	const input: any = {
		name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
	const mailerMock = sinon.mock(MailerGateway.prototype)
	mailerMock.expects("send").withArgs(input.email, "Verification").calledOnce;
	const accountDAOMock = sinon.mock(AccountDAO.prototype)
	accountDAOMock.expects('save').resolves()
	accountDAOMock.expects('getByEmail').resolves()
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const getByIdStub = sinon.stub(AccountDAO.prototype, 'getById').resolves(Account.create(input.name,input.email, input.cpf, input.isPassenger, false, ''));
  await accountService.getAccount(output.accountId);
	mailerMock.verify()
	accountDAOMock.verify()
	mailerMock.restore()
	accountDAOMock.restore()
	getByIdStub.restore()
});

test('Deve criar um passageiro com fake', async function () {
	const accountDAO = new AccountDAOMemory();
	const input: any = {
		name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
  };
  const accountService = new AccountService(accountDAO);
  const output = await accountService.signup(input);
  const account = await accountService.getAccount(output.accountId);
	expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
});