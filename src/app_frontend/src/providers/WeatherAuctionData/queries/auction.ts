import { gql } from '@apollo/client';

export const GET_BIDS = gql`
  query GetBids($day: Int!) {
    bidPlaceds(first: 100, where: { day: $day }) {
      id
      bidder
      temperatureGuess
      day
      ticketCount
    }
    winnerDeclareds(first: 100) {
      id
      winner
      day
      temperature
      winnerPrize
    }
  }
`;
