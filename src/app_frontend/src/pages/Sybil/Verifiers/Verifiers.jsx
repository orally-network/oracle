import React from 'react';
import { Table } from 'antd';

import styles from './Verifiers.scss';

const verifiers = [
  {
    id: 80001,
    name: 'Mumbai',
    verifierAddress: '0xE051d33EEe3F44e5B8bfDB1329cD054670a0b81A',
  },
  {
    id: 5,
    name: 'Goerli',
    verifierAddress: '0x36C989158DC13a3ae7fe45318bCa417C45055c48',
  },
  {
    id: 59140,
    name: 'Linea',
    verifierAddress: '0xDFB6d80A003907c3021c714F8C60f284Ee259f58',
  },
  {
    id: 35443,
    name: 'Q Testnet',
    verifierAddress: '0xc4691e0A3d69681a8c9b6CbC62B14584D93841b6',
  },
  {
    id: 1230,
    name: 'Ultron Testnet',
    verifierAddress: '0x51c84C7430FEE3FC07B903400F70167644b0AfDE',
  },
  {
    id: 97,
    name: 'BSC Testnet',
    verifierAddress: '0xec4b9D8B068233F89B03f0B806C98D1b550780f6',
  },
  {
    id: 420,
    name: 'Optimism Goerli Testnet',
    verifierAddress: '0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f',
  },
  {
    id: 421613,
    name: 'Arbitrum Goerli Testnet',
    verifierAddress: '0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f',
  },
  {
    id: 10200,
    name: 'Gnosis Chiado Testnet',
    verifierAddress: '0xCFf00E5f685cCE94Dfc6d1a18200c764f9BCca1f',
  },
  {
    id: 1313161555,
    name: 'Aurora Testnet',
    verifierAddress: '0x447e7fd904325e5aD65c05EE84E3d6775789b9Da',
  },
  {
    id: 355113,
    name: 'Bitfinity Testnet',
    verifierAddress: '0xb0Ca868a53A55E678F35D2a78ebE27b574567385',
  },
  {
    id: 43113,
    name: 'Avalanche Fuji Testnet',
    verifierAddress: '0x447e7fd904325e5aD65c05EE84E3d6775789b9Da',
  }
];

const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Verifier Address',
    dataIndex: 'verifierAddress',
    key: 'verifierAddress',
  },
];

const Verifiers = () => {
  return (
    <Table
      className={styles.verifiers}
      columns={columns}
      dataSource={verifiers}
      pagination={false} 
    />
  )
};

export default Verifiers;
