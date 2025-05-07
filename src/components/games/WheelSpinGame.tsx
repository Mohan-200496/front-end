
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Wheel segments with multipliers
const wheelSegments = [
  { value: 0.5, color: '#F87171', label: '0.5x' },
  { value: 1, color: '#60A5FA', label: '1x' },
  { value: 1.5, color: '#34D399', label: '1.5x' },
  { value: 2, color: '#FBBF24', label: '2x' },
  { value: 0, color: '#A78BFA', label: '0x' },
  { value: 5, color: '#F472B6', label: '5x' },
  { value: 0.2, color: '#4ADE80', label: '0.2x' },
  { value: 10, color: '#FB923C', label: '10x' }
];

export default function WheelSpinGame() {
  const [betAmount, setBetAmount] = useState(10);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
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
  
  const handleSpin = async () => {
    if (isSpinning) return;
    if (betAmount > user.balance) {
      toast.error("You don't have enough funds for this bet");
      return;
    }
    
    setIsSpinning(true);
    setShowResult(false);
    setResult(null);
    setSelectedSegment(null);
    
    // Determine result segment
    const segmentIndex = Math.floor(Math.random() * wheelSegments.length);
    const multiplier = wheelSegments[segmentIndex].value;
    setResult(multiplier);
    
    // Calculate rotation (current + 5 full turns + segment position)
    const segmentDegrees = 360 / wheelSegments.length;
    const extraRotation = 360 * 5; // 5 full rotations
    const segmentRotation = segmentDegrees * segmentIndex;
    const totalRotation = rotationDeg + extraRotation + (360 - segmentRotation);
    
    setRotationDeg(totalRotation);
    setSelectedSegment(segmentIndex);
    
    const isWin = multiplier > 0;
    const profit = betAmount * multiplier - betAmount;
    
    // Wait for wheel to stop spinning
    setTimeout(() => {
      try {
        placeBet('wheelspin', betAmount, {
          multiplier,
          result: multiplier,
          isWin,
          profit
        });
        
        setShowResult(true);
        if (isWin && profit > 0) {
          toast.success(`You won $${profit.toFixed(2)}!`);
        } else if (multiplier === 1) {
          toast.info(`You broke even!`);
        } else {
          toast.error(`You lost $${betAmount - (betAmount * multiplier)}`);
        }
        setIsSpinning(false);
      } catch (error) {
        toast.error("Couldn't place bet. Please try again.");
        setIsSpinning(false);
      }
    }, 5000); // Match this with the CSS transition duration
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Wheel Spin</h1>
          <p className="text-muted-foreground">Spin the wheel and win up to 10x your bet</p>
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
              Set your bet amount and spin the wheel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="betAmount">Bet Amount</Label>
              <div className="flex justify-between">
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
            
            <div className="space-y-2">
              <h3 className="font-medium">Possible Multipliers</h3>
              <div className="grid grid-cols-4 gap-2">
                {wheelSegments.map((segment, idx) => (
                  <div
                    key={idx}
                    className="flex h-12 flex-col items-center justify-center rounded-md"
                    style={{ backgroundColor: segment.color + '40', color: segment.color }}
                  >
                    <span className="text-sm font-bold">{segment.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full"
              size="lg"
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? (
                <>
                  <RotateCw className="mr-2 h-5 w-5 animate-spin" />
                  Spinning...
                </>
              ) : (
                'Spin Wheel'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center justify-center lg:col-span-3">
          <div className="relative h-80 w-80">
            {/* Wheel */}
            <div className="absolute left-0 top-0 h-full w-full">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <g
                  transform={`rotate(${rotationDeg} 50 50)`}
                  style={{ transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                >
                  {wheelSegments.map((segment, idx) => {
                    const angle = 360 / wheelSegments.length;
                    const startAngle = idx * angle;
                    const endAngle = (idx + 1) * angle;
                    
                    // Calculate SVG arc path
                    const x1 = 50 + 45 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 50 + 45 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 50 + 45 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 45 * Math.sin((endAngle * Math.PI) / 180);
                    
                    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
                    
                    // SVG arc path
                    const path = `M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    
                    // Calculate text position
                    const textAngle = startAngle + angle / 2;
                    const textX = 50 + 30 * Math.cos((textAngle * Math.PI) / 180);
                    const textY = 50 + 30 * Math.sin((textAngle * Math.PI) / 180);
                    
                    return (
                      <g key={idx}>
                        <path
                          d={path}
                          fill={segment.color}
                          stroke="#fff"
                          strokeWidth="0.5"
                          className={selectedSegment === idx ? 'animate-pulse' : ''}
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="6"
                          fontWeight="bold"
                          style={{ transform: `rotate(${90 + textAngle}deg)`, transformOrigin: `${textX}px ${textY}px` }}
                        >
                          {segment.label}
                        </text>
                      </g>
                    );
                  })}
                </g>
                
                {/* Center of wheel */}
                <circle cx="50" cy="50" r="5" fill="#374151" />
                
                {/* Pointer */}
                <path d="M 50 5 L 47 15 L 53 15 Z" fill="#EF4444" />
              </svg>
            </div>
          </div>
          
          {showResult && result !== null && (
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold">
                {result > 1 ? 'You Won!' : result === 1 ? 'You broke even!' : 'You Lost!'}
              </h2>
              <p className="mt-2 text-lg">
                The wheel landed on{' '}
                <span className="font-semibold">{result}x</span>
              </p>
              <p
                className={`mt-2 text-xl font-bold ${
                  result > 1 ? 'text-green-600' : result === 1 ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                {result >= 1
                  ? `+$${(betAmount * result - betAmount).toFixed(2)}`
                  : `-$${(betAmount - betAmount * result).toFixed(2)}`}
              </p>
            </div>
          )}
          
          {!isSpinning && !showResult && (
            <div className="mt-8 text-center text-lg text-muted-foreground">
              Place your bet and spin the wheel!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
