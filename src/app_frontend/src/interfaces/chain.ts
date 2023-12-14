export interface Chain {
  block_gas_limit: number;
  chain_id: number;
  fee: number[];
  min_balance: number;
  rpc: string;
  symbol: string[];
  img: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  explorerType: ExplorerType.ScanExplorer;
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  }
}

export enum ExplorerType {
  ScanExplorer = "Scan",
  BlockscoutExplorer = "Blockscout",
}
