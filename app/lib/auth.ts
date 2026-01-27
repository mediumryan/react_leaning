import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { getDefaultStore } from "jotai";
import { getUserProfile } from "./firestore_utils";
import { authLoadingAtom, currentUserAtom } from "~/data/userData";

// 회원가입
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 로그인
export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 로그아웃
export const logout = () => {
  return signOut(auth);
};

// 인증 상태 감지
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

const store = getDefaultStore();

let authListenerInitialized = false;

export function initAuthListener() {
  if (authListenerInitialized) return;
  authListenerInitialized = true;

  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const profile = await getUserProfile(firebaseUser.uid);
      store.set(currentUserAtom, profile);
    } else {
      store.set(currentUserAtom, null);
    }
    store.set(authLoadingAtom, false);
  });
}
