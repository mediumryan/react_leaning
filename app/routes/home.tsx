import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';
import { Navigate, useNavigate } from 'react-router';
import { ButtonGroup } from '~/components/ui/button-group';
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom, type Course } from '~/data/userData';
import { useState } from 'react';
import { H1_STYLE, H3_STYLE } from '~/components/styleFormat/style';
import { FaReact } from 'react-icons/fa';
import { BookOpen, MessagesSquare } from 'lucide-react';
import { getFirstContentId } from '~/helper/helper';
import { updateUserCourse } from '~/lib/firestore_utils';
import { contentsAtom } from '~/data/contentData';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'React Learning by Ryan' },
    { name: 'React Learning', content: 'Welcome to React Learning App!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents = useAtomValue(contentsAtom); // Get contents from atom

  const [selectedCourse, setSelectedCourse] = useState<Course>(
    currentUser?.course as Course | 'Beginner',
  );

  const handleClick = () => {
    // Pass contents to getFirstContentId
    if (contents) {
      const firstContentId = getFirstContentId(contents);
      if (firstContentId) {
        navigate(`/contents/${firstContentId}`);
      }
    }
  };

  const courseOptions: Course[] = ['Beginner', 'Intermediate', 'Advanced'];

  const handleClickChangeCourse = async () => {
    if (!currentUser) return;
    if (confirm(`コースを「${selectedCourse}」に変更しますか？`)) {
      try {
        // 1. Update Firestore first
        await updateUserCourse(currentUser.uid, selectedCourse);

        // 2. On success, update local Jotai state
        setCurrentUser({ ...currentUser, course: selectedCourse });

        alert('コースが変更されました');
      } catch (error) {
        console.error('Failed to update course:', error);
        alert('コースの変更に失敗しました。');
      }
    }
  };

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Ensure contents are loaded before rendering components that depend on them
  if (!contents) {
    return (
      <main className="p-8 flex flex-col justify-center items-center gap-2">
        <p>コンテンツを読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="p-8 flex flex-col justify-center items-center gap-2">
      <h1 className={`${H1_STYLE}` + ' flex items-center gap-3 tracking-wide'}>
        <FaReact id="react-icon" className="text-blue-600 animate-spin" />
        <span>React Learning</span>
      </h1>

      <div className="h-24"></div>

      {currentUser && (
        <h3 className={`${H3_STYLE}`}>ようこそ {currentUser?.name}さん!</h3>
      )}
      <ButtonGroup orientation="vertical" className="my-4 gap-1">
        {courseOptions.map((course) => (
          <Button
            key={course}
            variant={selectedCourse === course ? 'default' : 'outline'}
            onClick={() => setSelectedCourse(course)}
          >
            {course === 'Beginner'
              ? 'Beginner - 初心者コース'
              : course === 'Intermediate'
                ? 'Intermediate - 中級者コース'
                : 'Advanced - 上級者コース'}
          </Button>
        ))}
      </ButtonGroup>
      <Button variant="ghost" onClick={handleClickChangeCourse}>
        変更
      </Button>

      <div className="h-24"></div>

      <ButtonGroup className="gap-2">
        <Button onClick={handleClick}>
          <BookOpen className="w-4 h-4 mr-2" />
          <span>React学習</span>
        </Button>
        <Button onClick={() => navigate('/community')}>
          <MessagesSquare className="w-4 h-4 mr-2" />
          <span>コミュニティ</span>
        </Button>
      </ButtonGroup>
    </main>
  );
}
