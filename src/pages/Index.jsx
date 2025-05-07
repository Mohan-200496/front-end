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

  // Rest of component remains the same
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black to-black/80">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
              <span className="text-gold-500">STONKS</span> 
              <br />
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Play. Bet. Win.
              </span>
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-gold-300/80">
              Experience the thrill of betting without risking real money. Play five exciting games, track your performance, and compete for virtual fortunes!
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-gold-500 hover:bg-gold-600 text-black"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-gold-500 text-gold-500 hover:bg-gold-500/10"
              >
                Log In
              </Button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:mt-0 md:grid-cols-2">
            <div className="rounded-lg border border-gold-900/50 bg-black/40 p-6 shadow-lg shadow-gold-900/5 backdrop-blur-sm transition-all hover:shadow-gold-900/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-500">
                <CircleDollarSign className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gold-400">Play Cash Betting</h3>
              <p className="text-gold-300/80">
                Start with $10,000 play cash. No real money, just the thrill of the game!
              </p>
            </div>
            
            <div className="rounded-lg border border-gold-900/50 bg-black/40 p-6 shadow-lg shadow-gold-900/5 backdrop-blur-sm transition-all hover:shadow-gold-900/10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-500">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gold-400">Track Your Performance</h3>
              <p className="text-gold-300/80">
                Monitor your betting history, win rate, and overall profits.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gold-400">Our Games</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: 'Coin Flip', desc: '50/50 chance to double your money' },
              { name: 'Dice Roll', desc: 'Roll a dice and win 5x your bet' },
              { name: 'Wheel Spin', desc: 'Spin to win up to 10x your bet' },
              { name: 'Card Draw', desc: 'Red or black? Double your money!' },
              { name: 'Number Guess', desc: 'Guess right and win 9x your bet' }
            ].map((game, i) => (
              <div key={i} className="flex flex-col rounded-lg border border-gold-900/30 bg-black/40 p-6 shadow-lg backdrop-blur-sm transition-all hover:border-gold-900/50 hover:shadow-gold-900/10">
                <h3 className="mb-2 text-xl font-semibold text-gold-500">{game.name}</h3>
                <p className="mb-4 flex-1 text-sm text-gold-300/80">{game.desc}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-auto border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
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
