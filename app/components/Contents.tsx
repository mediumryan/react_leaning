import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { CONTENT_DATA } from '~/data/data';

interface ContentsProps {
  lectureId: string | undefined;
}

export default function Contents({ lectureId }: ContentsProps) {
  const data = CONTENT_DATA;

  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    // CONTENT_DATA에서 course가 lectureId인 항목의 content을 찾아 currentContent에 설정
    if (isNaN(Number(lectureId))) return;
    for (const section of data) {
      const found = section.sub_contents.find(
        (item) => item.course === Number(lectureId),
      );
      if (found) {
        setCurrentContent(found.content);
        break;
      }
    }
  }, [lectureId]);

  return (
    <Card className="p-8 z-0">{currentContent ?? 'No content available'}</Card>
  );
}
