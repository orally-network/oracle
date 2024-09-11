import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import pythiaCanister from './pythiaCanister';
import sybilCanister from './sybilCanister';

type Canister = {
  name: string;
  canister: any;
};

const CANISTERS: Canister[] = [
  {
    name: 'pythia',
    canister: pythiaCanister,
  },
  {
    name: 'sybil',
    canister: sybilCanister,
  },
  {
    name: 'apollo',
    canister: null,
    // canister: apolloCanister,
  },
];

type useCurrentCanisterResult = {
  currentCanister: (typeof CANISTERS)[0] | null;
};

export const useCurrentCanister = (): useCurrentCanisterResult => {
  const location = useLocation();
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const path = location.pathname.split('/')[1];
    const canister = CANISTERS.find((c) => c.name.includes(path));
    if (canister) {
      setRoute(canister.name);
    }
  }, [location]);

  return {
    currentCanister: CANISTERS.find((c) => c.name === route) || null,
  };
};
