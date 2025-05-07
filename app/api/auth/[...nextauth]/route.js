import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // 1. Connect to MongoDB
        await connectDB();

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        // 4. Return user object (this will be saved in the session/JWT)
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role, // ✅ include role
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Optional: your custom login page
  },

  // ✅ Callbacks to include role in JWT and Session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // ✅ add role to token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // ✅ add role to session
      return session;
    },
  },
});

export { handler as GET, handler as POST };
