
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
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
    } else if (value > 1000) {
      setBetAmount(1000);
    } else {
      setBetAmount(value);
    }
  };
  
  const handleQuickAmount = (amount: number) => {
    setBetAmount(amount);
  };
  
  const handleFlip = async () => {
    if (isFlipping) return;
    if (betAmount > user.balance) {
      toast.error("You don't have enough funds for this bet");
      return;
    }
    
    setIsFlipping(true);
    setShowResult(false);
    setResult(null);
    
    // Simulate flip animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine result (50/50 chance)
    const flipResult = Math.random() < 0.5 ? 'heads' : 'tails';
    setResult(flipResult);
    
    const isWin = flipResult === choice;
    
    try {
      placeBet('coinflip', betAmount, {
        userChoice: choice,
        result: flipResult,
        odds: 2,
        isWin
      });
      
      setTimeout(() => {
        setShowResult(true);
        if (isWin) {
          toast.success(`You won $${betAmount}!`);
        } else {
          toast.error(`You lost $${betAmount}`);
        }
        setIsFlipping(false);
      }, 500);
      
    } catch (error) {
      toast.error("Couldn't place bet. Please try again.");
      setIsFlipping(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coin Flip</h1>
          <p className="text-muted-foreground">50/50 chance to double your money</p>
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
              Choose heads or tails and set your bet amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Your Choice</Label>
              </div>
              <RadioGroup
                defaultValue="heads"
                value={choice}
                onValueChange={(value) => setChoice(value as 'heads' | 'tails')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="heads"
                    id="heads"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="heads"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <ArrowUp className="mb-3 h-8 w-8" />
                    Heads
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="tails"
                    id="tails"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="tails"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <ArrowDown className="mb-3 h-8 w-8" />
                    Tails
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="betAmount">Bet Amount</Label>
                <span className="text-sm text-muted-foreground">
                  Min: $10 | Max: $1,000
                </span>
              </div>
              <Input
                id="betAmount"
                type="number"
                min={10}
                max={1000}
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
                  onClick={() => handleQuickAmount(500)}
                >
                  $500
                </Button>
              </div>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleFlip}
              disabled={isFlipping}
            >
              {isFlipping ? 'Flipping...' : 'Flip Coin'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center lg:col-span-3">
          <div className="relative h-64 w-64">
            {/* Animated coin */}
            <div
              className={`absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg transition-all duration-1000 ${
                isFlipping
                  ? 'animate-[spin_1.5s_ease-in-out]'
                  : ''
              }`}
            >
              {result && (
                <div className="flex h-full items-center justify-center text-4xl font-bold">
                  {result === 'heads' ? <ArrowUp /> : <ArrowDown />}
                </div>
              )}
            </div>
          </div>
          
          {showResult && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">
                {result === choice ? 'You Won!' : 'You Lost'}
              </h2>
              <p className="mt-2 text-lg">
                The coin landed on{' '}
                <span className="font-semibold capitalize">{result}</span>
              </p>
              <p
                className={`mt-2 text-xl font-bold ${
                  result === choice ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {result === choice
                  ? `+$${betAmount}`
                  : `-$${betAmount}`}
              </p>
            </div>
          )}
          
          {!isFlipping && !showResult && (
            <div className="mt-8 text-center text-lg text-muted-foreground">
              Place your bet and flip the coin!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
