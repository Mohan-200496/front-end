
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { GAMES } from '@/lib/game-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDollarSign as Coin, Dice3, RotateCw, User as CardIcon, Dice1 } from 'lucide-react';

// Helper to get the proper icon for each game
const getGameIcon = (iconName: string) => {
  switch (iconName) {
    case 'coin':
      return <Coin className="h-8 w-8" />;
    case 'dice-3':
      return <Dice3 className="h-8 w-8" />;
    case 'rotate-cw':
      return <RotateCw className="h-8 w-8" />;
    case 'card':
      return <CardIcon className="h-8 w-8" />;
    case 'dice-1':
      return <Dice1 className="h-8 w-8" />;
    default:
      return <Coin className="h-8 w-8" />;
  }
};

export default function DashboardPage() {
  const { isLoggedIn, user } = useStore();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Welcome to Stonks</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a game to play and start winning!
        </p>
      </div>

      <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-primary/70 p-6 text-white shadow-md">
        <h2 className="text-xl font-semibold">Your Balance</h2>
        <p className="mt-2 text-4xl font-bold">${user.balance.toLocaleString()}</p>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Choose a Game</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Card key={game.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>{game.name}</CardTitle>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  {getGameIcon(game.icon)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="min-h-[60px]">{game.description}</CardDescription>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-muted p-2">
                  <div className="text-muted-foreground">Min Bet</div>
                  <div className="font-medium">${game.minBet}</div>
                </div>
                <div className="rounded-md bg-muted p-2">
                  <div className="text-muted-foreground">Max Bet</div>
                  <div className="font-medium">${game.maxBet}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={game.route}>Play Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
