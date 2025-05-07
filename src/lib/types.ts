
// Define types for the application

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  createdAt: string;
}

// Game types
export type GameType = "coinflip" | "diceroll" | "wheelspin" | "carddraw" | "numberguess";

// Bet type
export interface Bet {
  id: string;
  gameType: GameType;
  amount: number;
  outcome: "win" | "loss";
  profit: number;
  timestamp: string;
  details: {
    userChoice?: string | number;
    result?: string | number;
    odds?: number;
  };
}

// Game option type
export interface GameOption {
  id: GameType;
  name: string;
  description: string;
  minBet: number;
  maxBet: number;
  icon: string;
  route: string;
}
