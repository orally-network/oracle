import { createActor } from 'OD/createActor';
import config from 'Constants/config';

const sybilCanister = createActor(config.sybil_canister_id, 'sybil');

export default sybilCanister;
