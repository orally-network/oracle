import { createActor } from 'OD/createActor';
import config from 'Constants/config';

const pythiaCanister = createActor(config.pythia_canister_id, 'pythia');

export default pythiaCanister;
