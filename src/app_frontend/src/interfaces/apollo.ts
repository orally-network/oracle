export interface ApolloInstance {
  apollo_instance: {
    canister_id: string;
    chain_id: number | bigint;
    is_active: boolean;
  };
}

// export interface ApolloGetInstancesResponse {
//   apollo_instances: ApolloInstance[];
//   chain_id: number | bigint;
// }
