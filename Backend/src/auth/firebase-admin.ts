import { initializeApp, cert, getApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing Firebase Admin config: ${name}`);
    }

    return value;
}

function getFirebaseAdminApp() {
    if (getApps().length) {
        return getApp();
    }

    return initializeApp({
        credential: cert({
            projectId: getRequiredEnv('FIREBASE_PROJECT_ID'),
            clientEmail: getRequiredEnv('FIREBASE_CLIENT_EMAIL'),
            privateKey: getRequiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        }),
    });
}

export function getFirebaseAdminAuth() {
    return getAuth(getFirebaseAdminApp());
}
