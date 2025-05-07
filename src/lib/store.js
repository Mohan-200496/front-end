
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Store types
const useStore = create(
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
        
        // For demo, we'll just check if the email contains "user" or "player"
        const mockUser = {
          id: generateId(),
          username: email.includes('user') ? 'User' : 'Player',
          email: email,
          balance: 10000, // Starting with 10,000 play cash
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: mockUser,
          isLoggedIn: true
        });
        toast.success('Successfully logged in!');
      },
      
      signup: (username, email, password) => {
        // In a real app, this would call an API
        const newUser = {
          id: generateId(),
          username,
          email,
          balance: 10000, // Starting balance
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: newUser,
          isLoggedIn: true
        });
        toast.success('Account created successfully!');
      },
      
      logout: () => {
        set({
          user: null,
          isLoggedIn: false
        });
        toast.info('Logged out successfully');
      },
      
      // Game actions
      placeBet: (gameType, amount, details) => {
        const { user } = get();
        
        if (!user) throw new Error('User not logged in');
        if (user.balance < amount) throw new Error('Insufficient funds');
        
        const isWin = details.isWin;
        const profit = isWin ? amount * (details.odds || 1) : -amount;
        
        const newBet = {
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
        
        // Add notification for bet result using toast
        if (isWin) {
          toast.success(`You won $${profit}!`);
        } else {
          toast.error(`You lost $${amount}!`);
        }
        
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
        
        // Display toast based on notification type
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast.info(message);
        
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
      name: 'stonks-storage', // name of the item in localStorage
      // Only persist user, bets and login status
      partialize: (state) => ({ 
        user: state.user, 
        bets: state.bets,
        isLoggedIn: state.isLoggedIn 
      }),
    }
  )
);

export { useStore };
