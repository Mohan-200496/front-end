
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Bet, GameType } from './types';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Initial user data
const initialUser: User = {
  id: generateId(),
  username: 'Player',
  email: 'player@example.com',
  balance: 10000, // Starting with 10,000 play cash
  createdAt: new Date().toISOString(),
};

// Store types
interface StoreState {
  user: User | null;
  bets: Bet[];
  isLoggedIn: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    read: boolean;
  }>;
  
  // Auth actions
  login: (email: string, password: string) => void;
  signup: (username: string, email: string, password: string) => void;
  logout: () => void;
  
  // Game actions
  placeBet: (gameType: GameType, amount: number, details: any) => Bet;
  
  // Notification actions
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null, // Start with no user
      bets: [],
      isLoggedIn: false,
      notifications: [],
      
      // Auth actions
      login: (email, password) => {
        // In a real app, this would call an API
        // For now, just set the user as logged in with mock data
        set({
          user: initialUser,
          isLoggedIn: true
        });
        get().addNotification('Successfully logged in!', 'success');
      },
      
      signup: (username, email, password) => {
        // In a real app, this would call an API
        const newUser = {
          ...initialUser,
          username,
          email
        };
        set({
          user: newUser,
          isLoggedIn: true
        });
        get().addNotification('Account created successfully!', 'success');
      },
      
      logout: () => {
        set({
          user: null,
          isLoggedIn: false
        });
      },
      
      // Game actions
      placeBet: (gameType, amount, details) => {
        const { user } = get();
        
        if (!user) throw new Error('User not logged in');
        if (user.balance < amount) throw new Error('Insufficient funds');
        
        const isWin = details.isWin;
        const profit = isWin ? amount * (details.odds || 1) : -amount;
        
        const newBet: Bet = {
          id: generateId(),
          gameType,
          amount,
          outcome: isWin ? 'win' : 'loss',
          profit,
          timestamp: new Date().toISOString(),
          details
        };
        
        set(state => ({
          bets: [newBet, ...state.bets],
          user: {
            ...user,
            balance: user.balance + profit
          }
        }));
        
        // Add notification for bet result
        get().addNotification(
          isWin ? `You won ${profit}!` : `You lost ${amount}!`,
          isWin ? 'success' : 'error'
        );
        
        return newBet;
      },
      
      // Notification actions
      addNotification: (message, type) => {
        const newNotification = {
          id: generateId(),
          message,
          type,
          read: false
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== newNotification.id)
          }));
        }, 5000);
      },
      
      markNotificationAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: 'stonks-storage',
      partialize: (state) => ({ 
        user: state.user, 
        bets: state.bets,
        isLoggedIn: state.isLoggedIn 
      }),
    }
  )
);
