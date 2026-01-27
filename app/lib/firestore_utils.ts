import { firestore } from "./firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import type { User } from "~/data/userData";
import type { Content } from "~/data/contentData";

/**
 * Fetches a user's profile from the 'users' collection in Firestore.
 * @param uid The user's unique ID from Firebase Authentication.
 * @returns The user profile object or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDocRef = doc(firestore, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // Combine the UID (document ID) with the rest of the document data
    return { uid, ...userDocSnap.data() } as User;
  } else {
    console.error("No user profile found in Firestore for UID:", uid);
    return null;
  }
};

/**
 * Updates the course for a user in Firestore.
 * @param uid The user's unique ID.
 * @param newCourse The new course to set.
 */
export const updateUserCourse = async (uid: string, newCourse: string) => {
  const userDocRef = doc(firestore, "users", uid);
  await updateDoc(userDocRef, {
    course: newCourse,
  });
};

/**
 * Fetches all course content from the 'contents' collection.
 * @returns A promise that resolves to an array of content objects.
 */
export const getContents = async (): Promise<Content[]> => {
  const contentsCollectionRef = collection(firestore, "contents");
  const q = query(contentsCollectionRef, orderBy("section"), orderBy("order"));
  const querySnapshot = await getDocs(q);

  console.log("Fetched contents from Firestore:", querySnapshot);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Content[];
};
