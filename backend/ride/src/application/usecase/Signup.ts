import AccountDAO from '../repository/AccountDAO';
import MailerGateway from '../gateway/MailerGateway';
import Account from '../../domain/Account';

export default class Signup {
  mailerGateway: MailerGateway;

  constructor(readonly accountDAO: AccountDAO) {
    this.mailerGateway = new MailerGateway();
  }

  async execute(input: Input) {
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error('Account already exists');
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.isPassenger,
      input.isDriver,
      input.carPlate,
    );
    await this.accountDAO.save(account);
    await this.mailerGateway.send(
      account.email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`,
    );
    return { accountId: account.accountId };
  }
}

type Input = {
  email: string,
  name: string,
  cpf: string,
  isPassenger: boolean,
  isDriver: boolean,
  carPlate: string,
}
