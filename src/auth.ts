import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DefaultSession } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { User } from "./types/db";
import { pool } from "./lib/db";
import { compare } from "bcryptjs";
declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface User {
        username: string;
        role: "admin" | "user";
        subdivision_id?: number ;
    }
    interface Session {
        user: {
            id:string,
            username: string;
            email: string;
            role: "admin" | "user";
            subdivision_id?: number ;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
    interface JWT {
        id:string;
        username: string;
        email: string;
        role: "admin" | "user";
        subdivision_id?: number;
    }
}
class InvalidEmailOrPassword extends CredentialsSignin {
    code = "Invalid email or password";
}
class InvalidLoginError extends CredentialsSignin {
    code = "Invalid username or password";
}
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const { email, password } = credentials;
                if(typeof email !== 'string' || typeof password !== 'string'){
                    throw new InvalidEmailOrPassword();
                }


                const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
                const typedUsers = users as User[];
                if(typedUsers.length === 0){
                    throw new InvalidLoginError();
                }
                const loginUser = typedUsers[0];

                //compare password
                const valid = await compare(password, loginUser.password);
                if(!valid){
                    throw new InvalidLoginError();
                }
                return {
                    id: loginUser.id.toString(),
                    username: loginUser.username,
                    email: loginUser.email,
                    role: loginUser.role,
                    subdivision_id: loginUser.subdivision_id
                }

                
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
          if (user) { 
            token.id = user?.id ?? ""
            token.email = user?.email ?? ""
            token.username = user?.username ?? ""
            token.role = user?.role
            token.subdivision_id = user?.subdivision_id
          }
          return token
        },
        session({ session, token }) {
            session.user.id = token.id
          session.user.email = token.email
          session.user.username = token.username
          session.user.role = token.role
            session.user.subdivision_id = token.subdivision_id
          return session
        },
    }
});
