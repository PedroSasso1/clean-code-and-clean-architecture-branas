import TokenGenerator from '../../domain/TokenGenerator';
import RepositoryFactory from '../factory/RepositoryFactory';
import AccountRepository from '../repository/AccountRepository';

export default class Login {
  readonly accountRepository: AccountRepository;

  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.accountRepository = repositoryFactory.createAccountRepository();
  }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getByEmail(input.email);
    if (!account) throw new Error('Authentication failed');
    if (!account.password.validate(input.password))
      throw new Error('Authentication failed');
    const token = TokenGenerator.generate(account, input.date);
    return {
      token,
    };
  }
}

type Input = {
  email: string;
  password: string;
  date: Date,
}

type Output = {
  token: string
}
