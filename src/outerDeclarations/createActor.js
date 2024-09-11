import { HttpAgent, Actor } from '@dfinity/agent';

import config from 'Constants/config';

import { idlFactory as pythiaIdl } from './pythia.did';
import { idlFactory as sybilIdl } from './sybil.did';
import { idlFactory as apolloIdl } from './apollo.did';

const NAME_IDL_MAP = {
  pythia: pythiaIdl,
  sybil: sybilIdl,
  apollo: apolloIdl,
};

export const createActor = (canisterId, name = 'pythia', agentOptions = {}, actorOptions) => {
  if (!NAME_IDL_MAP[name]) throw new Error(`No IDL found for canister ${name}`);
  if (!canisterId) throw new Error('No canisterId provided');

  const agent = new HttpAgent({ host: config.HOST, ...agentOptions });

  // Fetch root key for certificate validation during development
  // eslint-disable-next-line no-undef
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor(NAME_IDL_MAP[name], {
    agent,
    canisterId,
    ...actorOptions,
  });
};
