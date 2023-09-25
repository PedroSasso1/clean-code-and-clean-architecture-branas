import AccountDAO from './AccountDAO';
import AccountDAODatabase from './AccountDAODatabase';

export default class GetAccount {
  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {}

  async execute(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
