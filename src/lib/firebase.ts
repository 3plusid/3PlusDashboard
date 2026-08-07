import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Project, User, CompanySettings } from '../types';
import { MOCK_PROJECTS, MOCK_USERS } from '../data/mockData';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with specific database ID if provided
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Seed initial mock data to Firestore if collection is empty
export const seedInitialDataIfEmpty = async (
  defaultSettings: CompanySettings
) => {
  try {
    // Check projects
    const projectsRef = collection(db, 'projects');
    const projectsSnap = await getDocs(projectsRef);
    if (projectsSnap.empty) {
      console.log('Seeding projects to Firestore...');
      const batch = writeBatch(db);
      MOCK_PROJECTS.forEach((proj) => {
        const docRef = doc(db, 'projects', String(proj.id));
        batch.set(docRef, proj);
      });
      await batch.commit();
    }

    // Check users
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    if (usersSnap.empty) {
      console.log('Seeding users to Firestore...');
      const batch = writeBatch(db);
      MOCK_USERS.forEach((u) => {
        const docRef = doc(db, 'users', String(u.id));
        batch.set(docRef, u);
      });
      await batch.commit();
    }

    // Check company settings
    const settingsDocRef = doc(db, 'companySettings', 'main');
    const settingsSnap = await getDocs(collection(db, 'companySettings'));
    if (settingsSnap.empty) {
      console.log('Seeding company settings to Firestore...');
      await setDoc(settingsDocRef, defaultSettings);
    }
  } catch (err) {
    console.error('Error seeding initial Firebase data:', err);
  }
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
