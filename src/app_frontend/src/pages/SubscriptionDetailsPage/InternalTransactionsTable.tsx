import { Subscription } from 'Interfaces/subscription';
import React from 'react';
import { useInternalTransactions } from './useInternalTransactions';

interface InternalTransactionsProps {
  subscription: Subscription;
}

export const InternalTransactionsTable = ({subscription}: InternalTransactionsProps) => {

  const { isLoading, transactions } =  useInternalTransactions({
    chainId: subscription.method.chain_id as number,
    contractAddress: subscription.contract_addr,
  });

  console.log(transactions, 'InternalTransactionsTable');

  return (
    <div>
      <h1>InternalTransactionsTable</h1>
      {isLoading ? ("Loading...") : (
        <div>
          {transactions.map((transaction) => (
            <div key={transaction.hash}>
              {transaction.hash} tx
            </div>
          ))}
        </div>
      )}
    </div>
  )
};