import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if admin login
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;
          
          // Check if admin credentials match
          if (
            credentials.email === adminEmail && 
            credentials.password === adminPassword
          ) {
            console.log("Admin login successful");
            
            // Return admin user object
            return {
              id: 'admin-id',
              name: 'Administrator',
              email: adminEmail,
              role: 'admin'
            };
          }

          // For regular users, check database
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          
          if (!user) {
            return null;
          }
          
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordMatch) {
            return null;
          }
          
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };