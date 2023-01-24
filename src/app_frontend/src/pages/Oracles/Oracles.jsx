import React, { useEffect, useState } from 'react';

import { oracle_factory } from 'Declarations/oracle_factory';

import Oracle from './Oracle';

import styles from './Oracles.scss';

const Oracles = () => {
  const [oracles, setOracles] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setOracles(
        await oracle_factory.get_oracles()
      );
    };

    fetch();
  }, []);

  return (
    <div className={styles.oracles}>
      {oracles.map((oracle, i) => <Oracle key={i} {...oracle} />)}
    </div>
  );
};

export default Oracles;
