import React, { useEffect, useMemo, useState } from 'react';

import { createActor as createOracleActor } from 'Declarations/oracle';
import { CHAINS_MAP } from 'Constants/chains';

import Oracle from './Oracle';

const OracleContainer = ({ oracleId }) => {
  const [state, setState] = useState();

  const oracle = useMemo(() => createOracleActor(oracleId), [oracleId]);

  useEffect(() => {
    const fetch = async () => {
      const state = await oracle.get_state();

      setState({
        ...state,
        chain: CHAINS_MAP[state.chain_id],
      });
    };

    if (oracle) {
      fetch();
    }
  }, [oracle]);

  const isLoading = !state?.fetcher;

  return !isLoading && (
    <Oracle
      oracleId={oracleId}
      oracle={oracle}
      {...state}
    />
  );
}

export default OracleContainer;
