
import { GameOption } from './types';

export const GAMES: GameOption[] = [
  {
    id: 'coinflip',
    name: 'Coin Flip',
    description: 'Flip a coin and bet on heads or tails. 50/50 chance to double your money!',
    minBet: 10,
    maxBet: 1000,
    icon: 'coin',
    route: '/games/coinflip'
  },
  {
    id: 'diceroll',
    name: 'Dice Roll',
    description: 'Roll a dice and bet on the number. 1 in 6 chance to win 5x your bet!',
    minBet: 10,
    maxBet: 500,
    icon: 'dice-3',
    route: '/games/diceroll'
  },
  {
    id: 'wheelspin',
    name: 'Wheel Spin',
    description: 'Spin the wheel and win up to 10x your bet!',
    minBet: 10,
    maxBet: 200,
    icon: 'rotate-cw',
    route: '/games/wheelspin'
  },
  {
    id: 'carddraw',
    name: 'Card Draw',
    description: 'Draw a card and bet on red or black. 50/50 chance to double your money!',
    minBet: 10,
    maxBet: 1000,
    icon: 'card',
    route: '/games/carddraw'
  },
  {
    id: 'numberguess',
    name: 'Number Guess',
    description: 'Guess a number between 1 and 10. 1 in 10 chance to win 9x your bet!',
    minBet: 10,
    maxBet: 200,
    icon: 'dice-1',
    route: '/games/numberguess'
  }
];
