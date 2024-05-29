import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { dynamicQueryKeys } from '../dynamicQueryKeys.ts';

import config from 'Constants/config';
import { VerifyData } from 'Interfaces/feed';

interface useGetFeedDataWithProofProps {
  id: string;
}

interface useGetFeedDataWithProofResult {
  isLoading: boolean;
  verifyData: VerifyData | undefined;
}

export const useGetFeedDataWithProof = ({
  id,
}: useGetFeedDataWithProofProps): useGetFeedDataWithProofResult => {
  const queryClient: QueryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    [dynamicQueryKeys.feedDataWithProof(id)],
    async () => {
      const response = await fetch(
        `https://${config.sybil_canister_id}.icp0.io/get_feed_data_with_proof?id=${id}`
      );

      const signatureData = await response.json();

      queryClient.setQueryDefaults(id.toString(), {
        cacheTime: Infinity,
        staleTime: Infinity,
      });

      queryClient.setQueryData(id.toString(), data);

      return {
        signatureData,
      };
    },
    {
      staleTime: 30 * 1000,
      keepPreviousData: true,
    }
  );

  return {
    isLoading,
    verifyData: data?.signatureData,
  };
};
