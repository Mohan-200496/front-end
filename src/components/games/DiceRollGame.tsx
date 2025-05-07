
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function DiceRollGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, placeBet } = useStore();
  
  if (!isLoggedIn || !user) {
    navigate('/login');
    return null;
  }
  
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value) || value < 10) {
      setBetAmount(10);
    } else if (value > 500) {
      setBetAmount(500);
    } else {
      setBetAmount(value);
    }
  };
  
  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount);
  };

  const getDiceIcon = (number: number) => {
    switch (number) {
      case 1:
        return <Dice1 className="h-full w-full" />;
      case 2:
        return <Dice2 className="h-full w-full" />;
      case 3:
        return <Dice3 className="h-full w-full" />;
      case 4:
        return <Dice4 className="h-full w-full" />;
      case 5:
        return <Dice5 className="h-full w-full" />;
      case 6:
        return <Dice6 className="h-full w-full" />;
      default:
        return <Dice1 className="h-full w-full" />;
    }
  };
  
  const handleRoll = async () => {
    if (isRolling) return;
    if (betAmount > user.balance) {
      toast.error("You don't have enough funds for this bet");
      return;
    }
    
    setIsRolling(true);
    setShowResult(false);
    setResult(null);
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine result (1-6)
    const rollResult = Math.floor(Math.random() * 6) + 1;
    setResult(rollResult);
    
    const isWin = rollResult === choice;
    
    try {
      placeBet('diceroll', betAmount, {
        userChoice: choice,
        result: rollResult,
        odds: 5,
        isWin
      });
      
      setTimeout(() => {
        setShowResult(true);
        if (isWin) {
          toast.success(`You won $${betAmount * 5}!`);
        } else {
          toast.error(`You lost $${betAmount}`);
        }
        setIsRolling(false);
      }, 500);
      
    } catch (error) {
      toast.error("Couldn't place bet. Please try again.");
      setIsRolling(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dice Roll</h1>
          <p className="text-muted-foreground">Roll a dice and win 5x your bet</p>
        </div>
        <div className="flex items-center rounded-lg bg-primary/10 px-4 py-2 text-lg font-medium">
          <CircleDollarSign className="mr-2 h-5 w-5 text-primary" />
          ${user.balance.toLocaleString()}
        </div>
      </div>
      
      <div className="grid flex-1 gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Place Your Bet</CardTitle>
            <CardDescription>
              Choose a number and set your bet amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Your Number</Label>
              </div>
              <RadioGroup
                defaultValue="1"
                value={choice.toString()}
                onValueChange={(value) => setChoice(parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6)}
                className="grid grid-cols-3 gap-4"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num}>
                    <RadioGroupItem
                      value={num.toString()}
                      id={`dice-${num}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`dice-${num}`}
                      className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="mb-1 h-10 w-10 text-primary">
                        {getDiceIcon(num)}
                      </div>
                      {num}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="betAmount">Bet Amount</Label>
                <span className="text-sm text-muted-foreground">
                  Min: $10 | Max: $500
                </span>
              </div>
              <Input
                id="betAmount"
                type="number"
                min={10}
                max={500}
                value={betAmount}
                onChange={handleBetAmountChange}
              />
              
              <div className="mt-2 grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(10)}
                >
                  $10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(50)}
                >
                  $50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(100)}
                >
                  $100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(200)}
                >
                  $200
                </Button>
              </div>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleRoll}
              disabled={isRolling}
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center lg:col-span-3">
          <div className="relative h-64 w-64">
            {/* Animated dice */}
            <div
              className={`flex h-full w-full items-center justify-center rounded-lg bg-white text-primary shadow-xl transition-all duration-1000 ${
                isRolling
                  ? 'animate-[bounce_0.5s_ease-in-out_infinite]'
                  : ''
              }`}
            >
              {result ? (
                <div className="h-48 w-48">{getDiceIcon(result)}</div>
              ) : (
                <div className="h-48 w-48 opacity-50">{getDiceIcon(choice)}</div>
              )}
            </div>
          </div>
          
          {showResult && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">
                {result === choice ? 'You Won!' : 'You Lost'}
              </h2>
              <p className="mt-2 text-lg">
                The dice rolled{' '}
                <span className="font-semibold">{result}</span>
              </p>
              <p
                className={`mt-2 text-xl font-bold ${
                  result === choice ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result === choice
                  ? `+$${betAmount * 5}`
                  : `-$${betAmount}`}
              </p>
            </div>
          )}
          
          {!isRolling && !showResult && (
            <div className="mt-8 text-center text-lg text-muted-foreground">
              Place your bet and roll the dice!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
