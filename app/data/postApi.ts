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
} from 'firebase/firestore';
import { firestore, storage } from '~/lib/firebase';
import type { PostType } from './postData';
import { deleteObject, ref } from 'firebase/storage';

export const deleteImageByUrl = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl);
  await deleteObject(imageRef);
};

export const getPosts = async (
  currentUserId?: string,
  postOrder: 'new' | 'popular' = 'new',
): Promise<PostType[]> => {
  const postsCollection = collection(firestore, 'posts');
  const q = query(postsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const posts: PostType[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();

    // likes 서브컬렉션에서 좋아요한 사용자 ID 확인
    const likesSnapshot = await getDocs(collection(docSnap.ref, 'likes'));
    const likedUserIds = likesSnapshot.docs.map((likeDoc) => likeDoc.id);

    posts.push({
      id: docSnap.id,
      title: data.title,
      content: data.content,
      projectLink: data.projectLink,
      imageUrl: data.imageUrl,
      likeCount: data.likeCount || likedUserIds.length,
      name: data.name,
      createdAt: data.createdAt.toDate(),
      isLiked: currentUserId ? likedUserIds.includes(currentUserId) : false,
      userId: data.userId,
    });
  }

  if (postOrder === 'new') {
    posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (postOrder === 'popular') {
    posts.sort((a, b) => b.likeCount - a.likeCount);
  }

  return posts;
};

export const addPost = async (
  post: Omit<PostType, 'id' | 'createdAt' | 'likeCount' | 'isLiked'>,
  userId: string,
) => {
  const newPost = {
    ...post,
    userId: userId,
    createdAt: Timestamp.now(),
    likeCount: 0,
  };

  const docRef = await addDoc(collection(firestore, 'posts'), newPost);

  return {
    ...newPost,
    id: docRef.id,
    likeCount: 0,
    isLiked: false,
  };
};

export const updatePost = async (
  id: string,
  prevPost: PostType,
  post: Partial<Omit<PostType, 'id'>>,
) => {
  const postRef = doc(firestore, 'posts', id);

  // 1️⃣ 이미지가 변경되었을 경우
  if (prevPost.imageUrl && post.imageUrl !== prevPost.imageUrl) {
    try {
      await deleteImageByUrl(prevPost.imageUrl);
    } catch (e) {
      console.warn('기존 이미지 삭제 실패', e);
    }
  }

  // 2️⃣ Firestore 업데이트
  await updateDoc(postRef, post);
};

export const deletePost = async (post: PostType) => {
  // 1️⃣ 이미지 삭제
  if (post.imageUrl) {
    try {
      await deleteImageByUrl(post.imageUrl);
    } catch (e) {
      console.warn('이미지 삭제 실패', e);
    }
  }

  // 2️⃣ Firestore 문서 삭제
  const postRef = doc(firestore, 'posts', post.id);
  await deleteDoc(postRef);
};

export const likePost = async (postId: string, userId: string) => {
  if (!userId) return;

  const postRef = doc(firestore, 'posts', postId);
  const likeRef = doc(collection(postRef, 'likes'), userId);

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
