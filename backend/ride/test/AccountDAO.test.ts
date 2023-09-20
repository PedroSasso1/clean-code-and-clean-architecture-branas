import AccountDAO from '../src/AccountDAODatabase';
import crypto from 'crypto';

test('Deve criar um registro na tabela account e consultar por email', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    date: new Date(),
    verificationCode: crypto.randomUUID(),
  };
  const accountDAO = new AccountDAO();
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getByEmail(account.email);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.cpf).toBe(account.cpf);
  expect(savedAccount.is_passenger).toBeTruthy();
  expect(savedAccount.date).toBeDefined();
  expect(savedAccount.verification_code).toBe(account.verificationCode);
});

test('Deve criar um registro na tabela account e consultar por account_id', async function () {
  const account = {
    accountId: crypto.randomUUID(),
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true,
    date: new Date(),
    verificationCode: crypto.randomUUID(),
  };
  const accountDAO = new AccountDAO();
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);
  expect(savedAccount.name).toBe(account.name);
  expect(savedAccount.email).toBe(account.email);
  expect(savedAccount.cpf).toBe(account.cpf);
  expect(savedAccount.is_passenger).toBeTruthy();
  expect(savedAccount.date).toBeDefined();
  expect(savedAccount.verification_code).toBe(account.verificationCode);
});
