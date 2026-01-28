import { firestore } from './firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
  setDoc, // Import setDoc for addUser
  deleteDoc, // Import deleteDoc for deleteUser
  writeBatch, // Import writeBatch for batch deletions
} from 'firebase/firestore';
import type { User } from '~/data/userData';
import type { Content } from '~/data/contentData';

/**
 * Fetches a user's profile from the 'users' collection in Firestore.
 * @param uid The user's unique ID from Firebase Authentication.
 * @returns The user profile object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDocRef = doc(firestore, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const userData = userDocSnap.data();

    // Fetch the contentStatus subcollection
    const contentStatusCollectionRef = collection(userDocRef, 'contentStatus');
    const contentStatusSnap = await getDocs(contentStatusCollectionRef);

    // Create a Set of completed content IDs
    const contentStatus = new Set(contentStatusSnap.docs.map((doc) => doc.id));

    return {
      uid,
      ...userData,
      contentStatus, // Overwrite with the Set
    } as User;
  } else {
    console.error('No user profile found in Firestore for UID:', uid);
    return null;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const usersCollectionRef = collection(firestore, 'users');
  const querySnapshot = await getDocs(usersCollectionRef);
  const users: User[] = [];

  for (const userDoc of querySnapshot.docs) {
    const userData = userDoc.data();
    const uid = userDoc.id;

    // Fetch the contentStatus subcollection for each user
    const contentStatusCollectionRef = collection(userDoc.ref, 'contentStatus');
    const contentStatusSnap = await getDocs(contentStatusCollectionRef);
    const contentStatus = new Set(contentStatusSnap.docs.map((doc) => doc.id));

    users.push({
      uid,
      ...userData,
      contentStatus,
    } as User);
  }

  return users;
};

/**
 * Adds a new user to Firestore.
 * @param user The user object to add.
 */
export const addUserToFirestore = async (user: User) => {
  const userDocRef = doc(firestore, 'users', user.uid);
  // Ensure contentStatus is not directly stored in the main user document
  const { contentStatus, ...userDataToStore } = user;
  await setDoc(userDocRef, userDataToStore);

  // Initialize an empty contentStatus subcollection (or add existing if any)
  // For new users, it should be empty. If user object has contentStatus, it would be from temporary state.
  // We'll create empty one or add based on provided for robustness, though new users start empty.
  const batch = writeBatch(firestore);
  contentStatus.forEach(contentId => {
    const contentStatusDocRef = doc(userDocRef, 'contentStatus', contentId);
    batch.set(contentStatusDocRef, { createdAt: new Date() }); // Use serverTimestamp() in actual creation
  });
  await batch.commit();
};


/**
 * Updates an existing user in Firestore.
 * @param uid The user's unique ID.
 * @param updates Partial user object with fields to update.
 */
export const updateUserInFirestore = async (uid: string, updates: Partial<User>) => {
  const userDocRef = doc(firestore, 'users', uid);
  // Do not allow contentStatus to be updated directly via this function
  const { contentStatus, ...updatesToApply } = updates;
  await updateDoc(userDocRef, updatesToApply);
};

/**
 * Deletes a user from Firestore, including their contentStatus subcollection.
 * @param uid The user's unique ID.
 */
export const deleteUserFromFirestore = async (uid: string) => {
  const userDocRef = doc(firestore, 'users', uid);

  // Delete all documents in the contentStatus subcollection
  const contentStatusCollectionRef = collection(userDocRef, 'contentStatus');
  const querySnapshot = await getDocs(contentStatusCollectionRef);
  const batch = writeBatch(firestore);
  querySnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Delete the main user document
  await deleteDoc(userDocRef);
};


/**
 * Updates the course for a user in Firestore.
 * @param uid The user's unique ID.
 * @param newCourse The new course to set.
 */
export const updateUserCourse = async (uid: string, newCourse: string) => {
  const userDocRef = doc(firestore, 'users', uid);
  await updateDoc(userDocRef, {
    course: newCourse,
  });
};

export const getContents = async (): Promise<Content[]> => {
  const contentsCollectionRef = collection(firestore, 'contents');
  const q = query(contentsCollectionRef, orderBy('section'), orderBy('order'));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      ...data,
    } as Content;
  });
};
