import RepositoryFactory from '../factory/RepositoryFactory';
import AccountRepository from '../repository/AccountRepository';

export default class GetAccount {
  readonly accountRepository: AccountRepository;

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.accountRepository = repositoryFactory.createAccountRepository();
  }

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountRepository.getById(accountId);
    if (!account) throw new Error('Account not found');
    return {
      accountId: account.accountId,
      name: account.name.getValue(),
      email: account.email.getValue(),
      cpf: account.cpf.getValue(),
      carPlate: account.carPlate.getValue(),
      isPassenger: account.isPassenger,
      isDriver: account.isDriver,
    };
  }
}

type Output = {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate: string;
  isPassenger: boolean;
  isDriver: boolean;
}
