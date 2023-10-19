import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RequestRide from './application/usecase/RequestRide';
import GetRide from './application/usecase/GetRide';
import RepositoryDatabaseFactory from './infra/factory/RepositoryDatabaseFactory';

const connection = new PgPromiseAdapter();
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const signup = new Signup(repositoryFactory)
const getAccount = new GetAccount(repositoryFactory)
const requestRide = new RequestRide(repositoryFactory)
const getRide = new GetRide(repositoryFactory);
const httpServer = new ExpressAdapter();
new MainController(httpServer, signup, getAccount, requestRide, getRide)
httpServer.listen(3000)
