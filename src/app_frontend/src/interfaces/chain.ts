export interface Chain {
  block_gas_limit: number;
  chain_id: number;
  fee: number[];
  min_balance: number;
  rpc: string;
  symbol: string[];
}