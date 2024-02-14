import { createActor } from 'OD/createActor';
import config from 'Constants/config';

const apolloCanister = createActor(config.apollo_canister_id, 'apollo');

export default apolloCanister;
