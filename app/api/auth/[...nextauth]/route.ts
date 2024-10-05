import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

// Define a type for the user object returned from the authorize function
interface CustomUser extends User {
  id: number; // Assuming id is a number
  name: string;
  role: string; // Assuming role is a string
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "ป้อนชื่อบัญชีผู้ใช้",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        // Specify the return type
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          // Check if the user role is admin
          if (user.role !== "ADMIN") {
            // Return an error message instead of throwing an error
            return Promise.reject(new Error("บัญชีของท่านไม่ได้รับอนุญาต")); // Not authorized
          }
          return {
            id: user.id,
            name: user.name,
            role: user.role,
          } as CustomUser; // Cast to CustomUser
        }
        return Promise.reject(
          new Error("ชื่อบัญชีผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add id to token
        token.role = user.role; // Add role to token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number; // Use the extended type
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/",
    signOut: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
