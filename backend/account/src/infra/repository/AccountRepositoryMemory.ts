import AccountRepository from '../../application/repository/AccountRepository';

export default class AccountRepositoryMemory implements AccountRepository {
  accounts: any[] = [];

  async save(account: any): Promise<void> {
    this.accounts.push(account);
  }

  async getByEmail(email: string): Promise<any> {
    const account = this.accounts.find((account) => account.email === email);
    if (!account) return;
    account.account_id = account.accountId;
    return account;
  }

  async getById(accountId: string): Promise<any> {
    const account = this.accounts.find(
      (account) => account.accountId === accountId,
    );
    if (!account) return;
    account.account_id = account.accountId;
    return account;
  }
}
