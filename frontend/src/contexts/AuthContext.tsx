import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

// Mock users - in a real application, this would come from a backend
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'password123'
  }
];

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, password: string): boolean => {
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};