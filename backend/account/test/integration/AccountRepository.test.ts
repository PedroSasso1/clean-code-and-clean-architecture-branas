import Account from '../../src/domain/Account';
import AccountRepositoryDatabase from '../../src/infra/repository/AccountRepositoryDatabase';
import AccountRepository from '../../src/infra/repository/AccountRepositoryDatabase';
import Connection from '../../src/infra/database/Connection';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';

let connection: Connection;
let accountRepository: AccountRepository;

beforeEach(function () {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryDatabase(connection);
});

test('Deve criar um registro na tabela account e consultar por email', async function () {
  const account = Account.create(
    'John Doe',
    `john.doe${Math.random()}@gmail.com`,
    '95818705552',
    true,
    false,
    '',
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getByEmail(account.email.getValue());
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue());
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBeTruthy();
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});

test('Deve criar um registro na tabela account e consultar por account_id', async function () {
  const account = Account.create(
    'John Doe',
    `john.doe${Math.random()}@gmail.com`,
    '95818705552',
    true,
    false,
    '',
  );
  await accountRepository.save(account);
  const savedAccount = await accountRepository.getById(account.accountId);
  expect(savedAccount?.name.getValue()).toBe(account.name.getValue());
  expect(savedAccount?.email.getValue()).toBe(account.email.getValue());
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue());
  expect(savedAccount?.isPassenger).toBeTruthy();
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});

afterEach(async function () {
  await connection.close()
})
