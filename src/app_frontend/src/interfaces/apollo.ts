export interface ApolloInstance {
  apollo_instance: {
    canister_id: string;
    chain_id: number | bigint;
    is_active: boolean;
  };
  chain_id: number | bigint;
}
