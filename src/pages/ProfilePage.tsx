
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function ProfilePage() {
  const { isLoggedIn, user, bets } = useStore();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  // Calculate statistics
  const totalBets = bets.length;
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWins = bets.filter((bet) => bet.outcome === 'win').length;
  const totalLosses = bets.filter((bet) => bet.outcome === 'loss').length;
  const winPercentage = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
  const netProfit = bets.reduce((sum, bet) => sum + bet.profit, 0);

  // Format date helper
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          View your betting history and statistics
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Current Balance</CardDescription>
            <CardTitle className="text-2xl">${user.balance.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Bets</CardDescription>
            <CardTitle className="text-2xl">{totalBets}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Win Rate</CardDescription>
            <CardTitle className="text-2xl">{winPercentage.toFixed(1)}%</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Profit/Loss</CardDescription>
            <CardTitle className={`text-2xl ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="history">
        <TabsList className="mb-4">
          <TabsTrigger value="history">Bet History</TabsTrigger>
          <TabsTrigger value="statistics">Detailed Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bets</CardTitle>
              <CardDescription>
                Your last {bets.length} bets are shown here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bets.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  You haven't placed any bets yet. Start playing to see your history!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Bet Amount</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead className="text-right">Profit/Loss</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bets.map((bet) => (
                        <TableRow key={bet.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(bet.timestamp)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {bet.gameType}
                          </TableCell>
                          <TableCell>${bet.amount}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                bet.outcome === 'win'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {bet.outcome === 'win' ? 'Won' : 'Lost'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                bet.profit >= 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {bet.profit >= 0 ? '+' : ''}${Math.abs(bet.profit)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Betting Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Wagered
                      </h3>
                      <p className="text-xl font-bold">${totalWagered.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Net Profit/Loss
                      </h3>
                      <p
                        className={`text-xl font-bold ${
                          netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Wins
                      </h3>
                      <p className="text-xl font-bold text-green-600">{totalWins}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Losses
                      </h3>
                      <p className="text-xl font-bold text-red-600">{totalLosses}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Win Percentage
                    </h3>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${winPercentage}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-sm">{winPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Games Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Group bets by game type */}
                {Object.entries(
                  bets.reduce((games, bet) => {
                    if (!games[bet.gameType]) {
                      games[bet.gameType] = {
                        totalBets: 0,
                        wins: 0,
                        losses: 0,
                        profit: 0,
                      };
                    }
                    games[bet.gameType].totalBets += 1;
                    if (bet.outcome === 'win') {
                      games[bet.gameType].wins += 1;
                    } else {
                      games[bet.gameType].losses += 1;
                    }
                    games[bet.gameType].profit += bet.profit;
                    return games;
                  }, {} as Record<string, { totalBets: number; wins: number; losses: number; profit: number }>)
                ).map(([gameType, stats]) => {
                  const winRate = (stats.wins / stats.totalBets) * 100;
                  return (
                    <div key={gameType} className="mb-4 border-b pb-4 last:mb-0 last:border-0 last:pb-0">
                      <h3 className="mb-2 capitalize">{gameType}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Bets:</span>{' '}
                          <span className="font-medium">{stats.totalBets}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Win Rate:</span>{' '}
                          <span className="font-medium">{winRate.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Profit:</span>{' '}
                          <span
                            className={`font-medium ${
                              stats.profit >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {stats.profit >= 0 ? '+' : ''}${stats.profit.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {bets.length === 0 && (
                  <div className="py-4 text-center text-muted-foreground">
                    Play some games to see your performance statistics!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
