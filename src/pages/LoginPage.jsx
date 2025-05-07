
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      setError('');
      login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md bg-black/60 backdrop-blur-sm border border-gold-800/50">
        <CardHeader className="space-y-1">
          <Logo size="md" />
          <CardTitle className="text-2xl text-center text-gold-400">Welcome Back</CardTitle>
          <CardDescription className="text-center text-gold-300/80">Sign in to your Stonks account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gold-400">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gold-800/50 bg-black/50 text-gold-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-gold-400">Password</Label>
                <a href="#" className="text-xs text-gold-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gold-800/50 bg-black/50 text-gold-300"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-black">
              <LogIn className="h-4 w-4" /> Sign In
            </Button>
            <div className="text-center text-sm text-gold-300">
              Don't have an account?{' '}
              <a
                onClick={() => navigate('/signup')}
                className="cursor-pointer text-gold-400 hover:underline"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
