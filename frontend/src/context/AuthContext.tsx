import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN, GET_ME } from "../apollo/queries";

interface User {
  id: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  employeeId?: string;
  employee?: {
    id: string;
    name: string;
    employeeId: string;
    department: string;
    position: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // GraphQL mutations and queries
  const [loginMutation] = useMutation(LOGIN);
  const { data: meData, loading: meLoading } = useQuery(GET_ME, {
    skip: !localStorage.getItem("authToken"),
    errorPolicy: "ignore",
  });

  // Initialize user from token on app start
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && meData?.me) {
      setUser(meData.me);
    }
    setLoading(meLoading);
  }, [meData, meLoading]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: { email, password },
        },
      });

      if (data?.login) {
        const { token, user: loggedInUser } = data.login;
        localStorage.setItem("authToken", token);
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    window.location.href = "/";
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
