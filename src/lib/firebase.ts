import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project, User, UserRole, CompanySettings } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// ---------------------------------------------------------------------------
// Authentication & access control
// ---------------------------------------------------------------------------
// Owners always have full (direktur) access. Keep this list in sync with
// OWNER_EMAILS in firestore.rules.
export const OWNER_EMAILS = ['3plus.id@gmail.com', 'info@3plusdesign.com'];

export const auth = getAuth(app);
auth.languageCode = 'id';

export interface AccessInfo {
  role: UserRole;
  name?: string;
}

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const authApi = {
  onChange: (cb: (user: FirebaseUser | null) => void) => onAuthStateChanged(auth, cb),
  signIn: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, normalizeEmail(email), password),
  signUp: async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, normalizeEmail(email), password);
    await sendEmailVerification(cred.user);
    return cred;
  },
  resetPassword: (email: string) => sendPasswordResetEmail(auth, normalizeEmail(email)),
  resendVerification: () => (auth.currentUser ? sendEmailVerification(auth.currentUser) : Promise.resolve()),
  reload: async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      // Refresh the ID token so Firestore rules see email_verified = true
      await auth.currentUser.getIdToken(true);
    }
    return auth.currentUser;
  },
  signOut: () => signOut(auth),
  /** Returns the access entry for an email, or null if this email has no access. */
  getAccess: async (email: string): Promise<AccessInfo | null> => {
    const e = normalizeEmail(email);
    if (OWNER_EMAILS.includes(e)) return { role: 'direktur' };
    const snap = await getDoc(doc(db, 'access', e));
    return snap.exists() ? (snap.data() as AccessInfo) : null;
  },
  setAccess: (email: string, info: AccessInfo) =>
    setDoc(doc(db, 'access', normalizeEmail(email)), info),
  removeAccess: (email: string) => deleteDoc(doc(db, 'access', normalizeEmail(email)))
};

// Firestore Sync Listeners
export const firestoreSync = {
  subscribeProjects: (onUpdate: (projects: Project[]) => void) => {
    const projectsRef = collection(db, 'projects');
    return onSnapshot(
      projectsRef,
      (snapshot) => {
        const items: Project[] = [];
        snapshot.forEach((doc) => {
          items.push(doc.data() as Project);
        });
        // Sort by ID or start date
        items.sort((a, b) => b.id - a.id);
        onUpdate(items);
      },
      (error) => {
        console.error('Error listening to projects:', error);
      }
    );
  },

  subscribeUsers: (onUpdate: (users: User[]) => void) => {
    const usersRef = collection(db, 'users');
    return onSnapshot(
      usersRef,
      (snapshot) => {
        const items: User[] = [];
        snapshot.forEach((doc) => {
          items.push(doc.data() as User);
        });
        items.sort((a, b) => a.id - b.id);
        onUpdate(items);
      },
      (error) => {
        console.error('Error listening to users:', error);
      }
    );
  },

  subscribeCompanySettings: (onUpdate: (settings: CompanySettings) => void) => {
    const docRef = doc(db, 'companySettings', 'main');
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data() as CompanySettings);
        }
      },
      (error) => {
        console.error('Error listening to company settings:', error);
      }
    );
  },

  saveProject: async (project: Project) => {
    const docRef = doc(db, 'projects', String(project.id));
    await setDoc(docRef, project, { merge: true });
  },

  deleteProject: async (projectId: number) => {
    const docRef = doc(db, 'projects', String(projectId));
    await deleteDoc(docRef);
  },

  saveUser: async (user: User) => {
    const docRef = doc(db, 'users', String(user.id));
    await setDoc(docRef, user, { merge: true });
  },

  deleteUser: async (userId: number) => {
    const docRef = doc(db, 'users', String(userId));
    await deleteDoc(docRef);
  },

  saveCompanySettings: async (settings: CompanySettings) => {
    const docRef = doc(db, 'companySettings', 'main');
    await setDoc(docRef, settings, { merge: true });
  }
};
