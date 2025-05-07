import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CircleDollarSign, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isLoggedIn } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If logged in, redirect to dashboard
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              <span className="text-primary">STONKS</span> 
              <br />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Play. Bet. Win.
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              Experience the thrill of betting without risking real money. Play five exciting games, track your performance, and compete for virtual fortunes!
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:mt-0 md:grid-cols-2">
            <div className="rounded-lg bg-card p-6 shadow transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CircleDollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Play Cash Betting</h3>
              <p className="text-muted-foreground">
                Start with $10,000 play cash. No real money, just the thrill of the game!
              </p>
            </div>
            
            <div className="rounded-lg bg-card p-6 shadow transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Track Your Performance</h3>
              <p className="text-muted-foreground">
                Monitor your betting history, win rate, and overall profits.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Games</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'Coin Flip', desc: '50/50 chance to double your money' },
              { name: 'Dice Roll', desc: 'Roll a dice and win 5x your bet' },
              { name: 'Wheel Spin', desc: 'Spin to win up to 10x your bet' },
              { name: 'Card Draw', desc: 'Red or black? Double your money!' },
              { name: 'Number Guess', desc: 'Guess right and win 9x your bet' }
            ].map((game, i) => (
              <div key={i} className="flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow">
                <h3 className="mb-2 text-xl font-semibold">{game.name}</h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">{game.desc}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-auto"
                  onClick={() => navigate('/signup')}
                >
                  Play Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
