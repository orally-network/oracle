import { gql } from '@apollo/client';

export const GET_BIDS = gql`
  query GetBids($day: Int!) {
    bidPlaceds(first: 100, where: { day: $day }) {
      id
      bidder
      temperatureGuess
      day
      ticketCount
      transactionHash
    }
    winnerDeclareds(first: 100, orderBy: day) {
      id
      winner
      day
      temperature
      winnerPrize
      transactionHash
    }
  }
`;
