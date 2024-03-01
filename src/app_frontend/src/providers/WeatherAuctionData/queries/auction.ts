import { gql } from '@apollo/client';

export const GET_BIDS = gql`
  query GetBids($day: Int!, $contract: Bytes!) {
    bidPlaceds(first: 100, where: { day: $day, contract: $contract }) {
      id
      bidder
      temperatureGuess
      day
      ticketCount
      transactionHash
      contract
    }
    winnerDeclareds(first: 100, orderBy: day, where: { contract: $contract }) {
      id
      winner
      day
      temperature
      winnerPrize
      transactionHash
    }
  }
`;
