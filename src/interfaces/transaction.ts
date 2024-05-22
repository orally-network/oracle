export interface InternalTransaction {
  blockNumber: number;
  timeStamp: number;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: number;
  gasUsed: number;
  traceId: string;
  isError: boolean;
  errCode: string;
}
