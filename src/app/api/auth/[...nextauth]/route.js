import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Debug logs
          console.log("🔍 Authorize function called with email:", credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Missing credentials");
            return null;
          }
          
          await connectDB();
          console.log("✅ Connected to MongoDB");
          
          // Find user without role filter initially
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase()
          });
          
          if (!user) {
            console.log("❌ No user found with email:", credentials.email);
            return null;
          }
          
          console.log("✅ User found:", user.email, "Role:", user.role);
          
          // Check password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isValid) {
            console.log("❌ Invalid password for user:", user.email);
            return null;
          }
          
          console.log("✅ Password valid for user:", user.email);
          
          // For admin login, check role
          if (credentials.email === 'admin@example.com') {
            if (user.role !== 'admin') {
              console.log("❌ User is not an admin");
              return null;
            }
            console.log("✅ Admin verification passed");
          }
          
          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("❌ Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }