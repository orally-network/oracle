import { gql } from '@apollo/client';

export const GET_BIDS = gql`
  query {
    bidPlaceds(first: 5) {
      id
      bidder
      temperatureGuess
      day
    }
    winnerDeclareds(first: 5) {
      id
      winner
      day
      temperature
    }
  }
`;
