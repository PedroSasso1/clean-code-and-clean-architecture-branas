import PositionRepository from '../repository/PositionRepository';
import RideRepository from '../repository/RideRepository';

// abstract factory
export default interface RepositoryFactory {
  createRideRepository(): RideRepository;
  createPositionRepository(): PositionRepository;
}
