import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserId } from "@/lib/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },

      // ログイン画面のsignInで実行される認証ロジック
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }
        const userName = credentials?.username as string;
        const password = credentials?.password as string;

        const userId = await getUserId(userName, password);
        if (!userId) {
          return null;
        }

        return {
          id: userId,
          name: userName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 5, // 5分 (これが本当の寿命)
    updateAge: 60 * 1, // 1分後の操作で更新
  },
  pages: {
    signIn: "/login",
  },
});
