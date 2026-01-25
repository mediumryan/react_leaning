import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { useAtomValue } from 'jotai';
import { contentsAtom } from '~/data/contentData';

interface ContentsProps {
  lectureId: string | undefined;
}

export default function Contents({ lectureId }: ContentsProps) {
  const contents = useAtomValue(contentsAtom);

  const [currentContent, setCurrentContent] = useState('');

  useEffect(() => {
    if (!lectureId || !contents) return;
    const foundContent = contents.find((item) => item.id === lectureId);
    if (foundContent) {
      setCurrentContent(foundContent.content);
    }
  }, [lectureId, contents]);

  return (
    <Card className="p-8 z-0">{currentContent ?? 'No content available'}</Card>
  );
}
