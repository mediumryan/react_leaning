import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { useAtomValue } from 'jotai';
import { contentsAtom, type Content } from '~/data/contentData';
import ContentQuiz from './ContentQuiz';

interface ContentsProps {
  lectureId: string | undefined;
}

export default function Contents({ lectureId }: ContentsProps) {
  const contents = useAtomValue(contentsAtom);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);

  useEffect(() => {
    if (!lectureId || !contents) return;
    const foundContent = contents.find((item) => item.id === lectureId);
    setCurrentContent(foundContent ?? null);
  }, [lectureId, contents]);

  const renderContent = () => {
    if (!currentContent) {
      return <p>No content available for this lecture.</p>;
    }

    switch (currentContent.type) {
      case 0:
        // Descriptive Content
        return <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />;
      case 1:
      case 2:
        // Multiple Choice or Short Answer Quiz
        return <ContentQuiz quiz={currentContent} />;
      default:
        return <p>Unknown content type.</p>;
    }
  };

  return <Card className="p-8 z-0 w-full">{renderContent()}</Card>;
}
