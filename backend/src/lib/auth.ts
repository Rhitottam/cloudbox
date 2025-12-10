import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/setup.js';

const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: 'sqlite',
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60,
        }
    }
});

export default auth;