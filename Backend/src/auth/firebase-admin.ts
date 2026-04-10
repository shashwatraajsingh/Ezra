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

    const projectId = getRequiredEnv('FIREBASE_PROJECT_ID');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
        return initializeApp({
            credential: cert({
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
            projectId,
        });
    }

    return initializeApp({ projectId });
}

export function getFirebaseAdminAuth() {
    return getAuth(getFirebaseAdminApp());
}
