/* import { api } from '@frontend/lib/api';
import type { PublicUser } from '@repo/backend/types/users';
import { createContext, useContext, useState, type ReactNode } from 'react';


type AuthContextType = {
  isAuthenticated: boolean,
  user: PublicUser | null,
  setUser: (user: PublicUser | null) => void,
  login: (email: string, password: string) => Promise<string | undefined>,
  logout: () => Promise<void>,
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  setUser: () => { },
  login: async () => undefined,
  logout: async () => { },
})

export const AuthProvider = ({ children, signedUser }: { children: ReactNode, signedUser?: PublicUser | null }) => {
  const [user, setUser] = useState<PublicUser | null | undefined>(signedUser);

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
    if (res.status === 404) {
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

export type AuthContext = ReturnType<typeof useAuth>; */

import type { PublicUser } from "@backend/db/types/users";
import { useAuthQuery, useAuthQueryOptions } from "@frontend/domain/auth-query";
import {
	type LoginResult,
	useLoginMutation,
} from "@frontend/domain/login-mutation";
import { useLogoutMutation } from "@frontend/domain/logout-mutation";
import router from "@frontend/lib/router";
import type { ToDiscriminatedUnion } from "@repo/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type AuthState = ToDiscriminatedUnion<
	{
		authenticated: {
			user: PublicUser;
		};
		unauthenticated: {
			user: null;
		};
		pending: {
			user: null;
		};
	},
	"status"
>;

type AuthUtils = {
	login: ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => Promise<LoginResult>;
	loginState: "success" | "error" | "pending" | "idle";
	logoutState: "success" | "error" | "pending" | "idle";
	logout: () => void;
	ensureData: () => Promise<PublicUser | null>;
};

export type AuthData = AuthState & AuthUtils;

export function useAuth(): AuthData {
	const authQuery = useAuthQuery();
	const queryClient = useQueryClient();
	const logoutMutation = useLogoutMutation();
	const loginMutation = useLoginMutation();

	useEffect(() => {
		router.invalidate();
	}, [authQuery.data]);

	useEffect(() => {
		if (authQuery.error === null) return;
		queryClient.setQueryData(["auth"], null);
	}, [authQuery.error, queryClient]);

	const utils: AuthUtils = {
		login: async ({ email, password }: { email: string; password: string }) => {
			const result = await loginMutation.mutateAsync({
				email,
				password,
			});

			return result;
		},
		logout: () => {
			logoutMutation.mutate();
		},
		ensureData: () => {
			return queryClient.ensureQueryData(useAuthQueryOptions());
		},
		loginState: loginMutation.status,
		logoutState: logoutMutation.status,
	};

	if (authQuery.status === "pending") {
		return {
			...utils,
			status: "pending",
			user: null,
		};
	} else if (authQuery.status === "success") {
		if (authQuery.data === null) {
			return {
				...utils,
				status: "unauthenticated",
				user: null,
			};
		} else if (authQuery.data.status === "success") {
			return {
				...utils,
				status: "authenticated",
				user: authQuery.data.user,
			};
		}
	}

	return {
		...utils,
		status: "unauthenticated",
		user: null,
	};
}
