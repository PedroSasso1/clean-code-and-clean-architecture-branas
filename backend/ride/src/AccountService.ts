import AccountDAO from './AccountDAO';
import MailerGateway from './MailerGateway';
import AccountDAODatabase from './AccountDAODatabase';
import Account from './Account';

export default class AccountService {
  mailerGateway: MailerGateway;

  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {
    this.mailerGateway = new MailerGateway();
  }

  async sendEmail(email: string, subject: string, message: string) {
    console.log(email, subject, message);
  }

  async signup(input: any) {
    const existingAccount = await this.accountDAO.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
    await this.accountDAO.save(account)
    await this.mailerGateway.send(
      account.email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`
    );
    return { accountId: account.accountId };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId)
    return account;
  }
}
