import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { firestore } from "~/lib/firebase";
import type { PostType } from "./postData";

export const getPosts = async (
  currentUserId?: string,
  postOrder: "new" | "popular" = "new",
): Promise<PostType[]> => {
  const postsCollection = collection(firestore, "posts");
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const posts: PostType[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();

    // likes 서브컬렉션에서 좋아요한 사용자 ID 확인
    const likesSnapshot = await getDocs(collection(docSnap.ref, "likes"));
    const likedUserIds = likesSnapshot.docs.map((likeDoc) => likeDoc.id);

    posts.push({
      id: docSnap.id,
      title: data.title,
      content: data.content,
      projectLink: data.projectLink,
      imageUrl: data.imageUrl,
      like: data.likeCount || likedUserIds.length,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      isLiked: currentUserId ? likedUserIds.includes(currentUserId) : false,
    });
  }

  if (postOrder === "new") {
    posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (postOrder === "popular") {
    posts.sort((a, b) => b.like - a.like);
  }

  return posts;
};

export const addPost = async (
  post: Omit<PostType, "id" | "createdAt" | "like" | "isLiked">,
) => {
  const newPost = {
    ...post,
    createdAt: Timestamp.now(),
    likeCount: 0,
  };

  const docRef = await addDoc(collection(firestore, "posts"), newPost);

  return {
    ...newPost,
    id: docRef.id,
    like: 0,
    isLiked: false,
  };
};

export const updatePost = async (
  id: string,
  post: Partial<Omit<PostType, "id">>,
) => {
  const postRef = doc(firestore, "posts", id);
  await updateDoc(postRef, post);
};

export const deletePost = async (id: string) => {
  const postRef = doc(firestore, "posts", id);
  await deleteDoc(postRef);
};

export const likePost = async (postId: string, userId: string) => {
  if (!userId) return;

  console.log("likePost called with postId:", postId, "userId:", userId);

  const postRef = doc(firestore, "posts", postId);
  const likeRef = doc(collection(postRef, "likes"), userId);

  const likeSnapshot = await getDoc(likeRef);
  const postSnapshot = await getDoc(postRef);

  if (!postSnapshot.exists()) return;

  const data = postSnapshot.data();
  let likeCount = data.likeCount || 0;

  if (!likeSnapshot.exists()) {
    // 좋아요 추가
    await setDoc(likeRef, { createdAt: Timestamp.now() });
    likeCount++;
  } else {
    // 좋아요 취소
    await deleteDoc(likeRef);
    likeCount--;
  }

  await updateDoc(postRef, { likeCount });
};
