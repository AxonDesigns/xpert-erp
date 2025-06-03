import { api } from '@frontend/lib/api';
import type { PublicUser } from '@repo/backend/types/users';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';


type AuthContextType = {
  isAuthenticated: boolean,
  isLoading: boolean,
  user: PublicUser | null,
  setUser: (user: PublicUser | null) => void,
  login: (email: string, password: string) => Promise<string | undefined>,
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  setUser: () => { },
  login: async () => undefined,
  logout: async () => { },
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<PublicUser | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.auth.me.$get({}, {
          init: {
            credentials: 'include',
          }
        });
        if (res.status === 200) {
          const data = await res.json();
          const user = {
            id: data.id,
            email: data.email,
            username: data.username,
            roleId: data.roleId,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
          } satisfies PublicUser;
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) { }

      setIsLoading(false);
    }

    init();
  }, []);

  const login = async (email: string, password: string): Promise<string | undefined> => {
    const res = await api.auth.login.$post({
      json: {
        email,
        password,
      }
    }, {
      init: {
        credentials: 'include',
      }
    });

    if (res.status === 200) {
      const data = await res.json();
      const user = {
        id: data.id,
        email: data.email,
        username: data.username,
        roleId: data.roleId,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      } satisfies PublicUser;
      setUser(user);
      return;
    }
    setUser(null);
    if(res.status === 404){
      const error = await res.json();
      return error.message;
    }
    
    if (res.status === 422) {
      const error = await res.json();
      return error.error.issues.join(", ");
    }

    return "Unknown error"
  }

  const logout = async () => {
    const res = await api.auth.logout.$post({}, {
      init: {
        credentials: 'include',
      }
    });
    if (res.status === 200) {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      isLoading,
      user: user || null,
      setUser,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export type AuthContext = ReturnType<typeof useAuth>;