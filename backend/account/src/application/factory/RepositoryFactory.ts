import AccountRepository from '../repository/AccountRepository';

// abstract factory
export default interface RepositoryFactory {
  createAccountRepository(): AccountRepository;
}
