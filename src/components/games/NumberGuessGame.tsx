
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign, Dice1 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function NumberGuessGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<number>(1);
  const [isGuessing, setIsGuessing] = useState(false);
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
    } else if (value > 200) {
      setBetAmount(200);
    } else {
      setBetAmount(value);
    }
  };
  
  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount);
  };
  
  const handleGuess = async () => {
    if (isGuessing) return;
    if (betAmount > user.balance) {
      toast.error("You don't have enough funds for this bet");
      return;
    }
    
    setIsGuessing(true);
    setShowResult(false);
    setResult(null);
    
    // Simulate guessing animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine result (1-10)
    const numberResult = Math.floor(Math.random() * 10) + 1;
    setResult(numberResult);
    
    const isWin = numberResult === choice;
    
    try {
      placeBet('numberguess', betAmount, {
        userChoice: choice,
        result: numberResult,
        odds: 9,
        isWin
      });
      
      setTimeout(() => {
        setShowResult(true);
        if (isWin) {
          toast.success(`You won $${betAmount * 9}!`);
        } else {
          toast.error(`You lost $${betAmount}`);
        }
        setIsGuessing(false);
      }, 500);
      
    } catch (error) {
      toast.error("Couldn't place bet. Please try again.");
      setIsGuessing(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Number Guess</h1>
          <p className="text-muted-foreground">Guess a number between 1 and 10 to win 9x your bet</p>
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
                onValueChange={(value) => setChoice(parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num}>
                    <RadioGroupItem
                      value={num.toString()}
                      id={`number-${num}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`number-${num}`}
                      className="flex cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover py-3 font-medium hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                    >
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
                  Min: $10 | Max: $200
                </span>
              </div>
              <Input
                id="betAmount"
                type="number"
                min={10}
                max={200}
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
              onClick={handleGuess}
              disabled={isGuessing}
            >
              {isGuessing ? 'Guessing...' : 'Guess Number'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center lg:col-span-3">
          <div className="relative h-64 w-64">
            {/* Number display */}
            <div
              className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-8xl font-bold text-white shadow-lg transition-all duration-500 ${
                isGuessing ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : ''
              }`}
            >
              {result !== null ? result : '?'}
            </div>
          </div>
          
          {showResult && result !== null && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">
                {result === choice ? 'You Won!' : 'You Lost'}
              </h2>
              <p className="mt-2 text-lg">
                The number was{' '}
                <span className="font-semibold">{result}</span>
              </p>
              <p
                className={`mt-2 text-xl font-bold ${
                  result === choice ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result === choice
                  ? `+$${betAmount * 9}`
                  : `-$${betAmount}`}
              </p>
            </div>
          )}
          
          {!isGuessing && !showResult && (
            <div className="mt-8 text-center text-lg text-muted-foreground">
              Place your bet and guess a number!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
