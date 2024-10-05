// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number; // Add the id property
      name: string | null; // Adjust based on your user model
      role: string | null; // Adjust based on your user model
      email?: string | null; // Optional, if you want to include email
      image?: string | null; // Optional, if you want to include image
    };
  }

  interface User {
    id: number; // Add the id property
    role: string; // Add the role property
  }

  interface JWT {
    id: number; // Add the id property
    role: string; // Add the role property
  }
}
