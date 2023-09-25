import Account from '../src/Account';
import AccountDAO from '../src/AccountDAODatabase';

test('Deve criar um registro na tabela account e consultar por email', async function () {
  const account = Account.create(
    'John Doe',
    `john.doe${Math.random()}@gmail.com`,
    '95818705552',
    true,
    false,
    '',
  );
  const accountDAO = new AccountDAO();
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getByEmail(account.email);
  expect(savedAccount?.name).toBe(account.name);
  expect(savedAccount?.email).toBe(account.email);
  expect(savedAccount?.cpf).toBe(account.cpf);
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
  const accountDAO = new AccountDAO();
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);
  expect(savedAccount?.name).toBe(account.name);
  expect(savedAccount?.email).toBe(account.email);
  expect(savedAccount?.cpf).toBe(account.cpf);
  expect(savedAccount?.isPassenger).toBeTruthy();
  expect(savedAccount?.date).toBeDefined();
  expect(savedAccount?.verificationCode).toBe(account.verificationCode);
});
