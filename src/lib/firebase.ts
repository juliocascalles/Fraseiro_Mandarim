import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Superusuário Júlio Cascalles:
 * Não terá restrições para excluir ou limpar salas.
 */
export function isSuperUser(user: { email?: string | null; displayName?: string | null } | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  const name = (user.displayName || '').toLowerCase().trim();
  return (
    email === 'julio.gamedesign@gmail.com' ||
    email.includes('julio.gamedesign') ||
    email.includes('cascalles') ||
    name.includes('júlio cascalles') ||
    name.includes('julio cascalles') ||
    name.includes('cascalles')
  );
}

// Sign in anonymously on load if no user is signed in (fallback)
export const initAnonymousAuth = async () => {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.warn('Firebase anonymous auth warning:', err);
  }
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operation: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
  };
}

export function handleFirestoreError(
  error: unknown,
  operation: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errObj = error as { code?: string; message?: string };
  const info: FirestoreErrorInfo = {
    error: errObj.message || String(error),
    operation,
    path,
    authInfo: {
      userId: auth.currentUser?.uid || 'anonymous',
    },
  };
  console.error(`[Firestore Error] Operation: ${operation} on ${path}:`, errObj);
  return info;
}
