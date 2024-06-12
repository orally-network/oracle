import { EVENT_NAME_DATA_FEED_REQUESTED, EVENT_NAME_RANDOM_FEED_REQUESTED } from './constants';

const APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI = [
  `event ${EVENT_NAME_DATA_FEED_REQUESTED}(uint256 indexed requestId, string dataFeedId, uint256 callbackGasLimit, address indexed requester);`,
  `event ${EVENT_NAME_RANDOM_FEED_REQUESTED}(uint256 indexed requestId, uint256 callbackGasLimit, uint256 numWords, address indexed requester);`,
];

export default APOLLO_COORDINATOR_CONTRACT_EVENTS_ABI;
