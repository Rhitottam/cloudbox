import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/database/setup';
import { envConfig } from '@/config';

const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: true, // Automatically sign in after signup
    },
    database: drizzleAdapter(db, {
        provider: 'sqlite',
    }),
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60,
        }
    },
    trustedOrigins: [envConfig.FRONTEND_URL!], // Allow frontend origin
});

export default auth;