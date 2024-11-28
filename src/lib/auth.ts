import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email) return null;

        try {
          const client = await clientPromise;
          const db = client.db("employee-tracking-2");

          const user = await db.collection("users").findOne({
            email: credentials.email,
          });

          if (!user) {
            // Create new account
            const account = await db.collection("accounts").insertOne({
              name: `${credentials.email}'s Account`,
              members: [
                {
                  email: credentials.email,
                  role: "admin",
                  invitedAt: new Date(),
                  joinedAt: new Date(),
                },
              ],
              companies: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Create new user
            const newUser = {
              email: credentials.email,
              name: credentials.email.split("@")[0],
              role: "admin" as const,
              accountId: account.insertedId.toString(),
            };

            const result = await db.collection("users").insertOne(newUser);

            return {
              id: result.insertedId.toString(),
              ...newUser,
            };
          }

          // Convert MongoDB _id to string id for existing user
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            accountId: user.accountId,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "admin" | "member" | "employee";
        session.user.accountId = token.accountId as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accountId = user.accountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
