import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      isPremium?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    username: string;
    isPremium?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    isPremium?: boolean;
  }
}

