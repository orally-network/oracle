import { createActor } from 'OD/createActor';
import config from 'Constants/config';

const treasurerCanister = createActor(config.treasurer_canister_id, 'treasurer');

export default treasurerCanister;
