import React, { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  user: any; // You can type this more strictly if desired
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  user: any;
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ user, children }) => {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 