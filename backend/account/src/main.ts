import Signup from './application/usecase/Signup';
import GetAccount from './application/usecase/GetAccount';
import PgPromiseAdapter from './infra/database/PgPromiseAdapter';
import MainController from './infra/controller/MainController';
import ExpressAdapter from './infra/http/ExpressAdapter';
import RepositoryDatabaseFactory from './infra/factory/RepositoryDatabaseFactory';
import Registry from './infra/dependency-injection/Registry';

const connection = new PgPromiseAdapter();
const repositoryFactory = new RepositoryDatabaseFactory(connection);
const httpServer = new ExpressAdapter();
const registry = Registry.getInstance();
registry.provide("signup", new Signup(repositoryFactory));
registry.provide("getAccount", new GetAccount(repositoryFactory));


new MainController(httpServer)
httpServer.listen(3000)
