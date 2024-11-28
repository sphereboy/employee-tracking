import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const client = await clientPromise;
        const db = client.db("employee-tracking-2");

        // Find or create user
        let user = await db.collection("users").findOne({
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
            role: "admin",
            accountId: account.insertedId.toString(),
          };

          const result = await db.collection("users").insertOne(newUser);
          user = { ...newUser, id: result.insertedId.toString() };
        }

        return user;
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
});

export { handler as GET, handler as POST };
