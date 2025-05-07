
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CardDrawGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [choice, setChoice] = useState<'red' | 'black'>('red');
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<'red' | 'black' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [drawnCard, setDrawnCard] = useState<string | null>(null);
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

  // Card suits and values
  const suits = ['♥', '♦', '♠', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const getRandomCard = () => {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const color = suit === '♥' || suit === '♦' ? 'red' as const : 'black' as const;
    return { suit, value, color };
  };
  
  const handleDraw = async () => {
    if (isDrawing) return;
    if (betAmount > user.balance) {
      toast.error("You don't have enough funds for this bet");
      return;
    }
    
    setIsDrawing(true);
    setShowResult(false);
    setResult(null);
    setDrawnCard(null);
    
    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine result
    const card = getRandomCard();
    setResult(card.color);
    setDrawnCard(`${card.value}${card.suit}`);
    
    const isWin = card.color === choice;
    
    try {
      placeBet('carddraw', betAmount, {
        userChoice: choice,
        result: card.color,
        odds: 2,
        isWin,
        card: `${card.value}${card.suit}`
      });
      
      setTimeout(() => {
        setShowResult(true);
        if (isWin) {
          toast.success(`You won $${betAmount}!`);
        } else {
          toast.error(`You lost $${betAmount}`);
        }
        setIsDrawing(false);
      }, 500);
      
    } catch (error) {
      toast.error("Couldn't place bet. Please try again.");
      setIsDrawing(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Card Draw</h1>
          <p className="text-muted-foreground">Draw a card and bet on red or black</p>
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
              Choose red or black and set your bet amount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Your Choice</Label>
              </div>
              <RadioGroup
                defaultValue="red"
                value={choice}
                onValueChange={(value) => setChoice(value as 'red' | 'black')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="red"
                    id="red"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="red"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 rounded-full bg-red-500 p-3 text-white">
                      ♥ ♦
                    </div>
                    Red
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="black"
                    id="black"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="black"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="mb-2 rounded-full bg-black p-3 text-white">
                      ♠ ♣
                    </div>
                    Black
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
              onClick={handleDraw}
              disabled={isDrawing}
            >
              {isDrawing ? 'Drawing...' : 'Draw Card'}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center lg:col-span-3">
          <div className="relative h-64 w-48">
            {/* Card */}
            <div
              className={`absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg border-4 border-gray-300 bg-white text-6xl font-bold shadow-lg transition-all duration-500 ${
                isDrawing ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : ''
              } ${
                result === 'red' ? 'text-red-600' : 'text-black'
              }`}
            >
              {drawnCard || '?'}
            </div>
          </div>
          
          {showResult && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">
                {result === choice ? 'You Won!' : 'You Lost'}
              </h2>
              <p className="mt-2 text-lg">
                The card drawn was{' '}
                <span className={`font-semibold ${result === 'red' ? 'text-red-600' : 'text-black'}`}>
                  {drawnCard} ({result})
                </span>
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
          
          {!isDrawing && !showResult && (
            <div className="mt-8 text-center text-lg text-muted-foreground">
              Place your bet and draw a card!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
