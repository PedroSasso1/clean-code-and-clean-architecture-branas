import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RequestRide from './application/usecase/RequestRide';
import GetRide from './application/usecase/GetRide';
import RepositoryDatabaseFactory from './infra/factory/RepositoryDatabaseFactory';
import Registry from './infra/dependency-injection/Registry';

const connection = new PgPromiseAdapter();
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const httpServer = new ExpressAdapter();
const registry = Registry.getInstance();
registry.provide("signup", new Signup(repositoryFactory));
registry.provide("getAccount", new GetAccount(repositoryFactory));
registry.provide("requestRide", new RequestRide(repositoryFactory));
registry.provide("getRide", new GetRide(repositoryFactory));

new MainController(httpServer)
httpServer.listen(3000)
