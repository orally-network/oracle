export type Winner = {
  day: string;
  id: string;
  winner: string;
  winnerPrize: string;
  temperature: string;
  transactionHash: string;
};

export type Bidder = {
  id: string;
  bidder: string;
  temperatureGuess: string;
  day: string;
  ticketCount: string;
  transactionHash: string;
};
