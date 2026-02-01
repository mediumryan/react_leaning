import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useAtom } from "jotai";
import ContentQuiz from "./ContentQuiz";
import { contentsQueryAtom, type Content } from "~/data/contentData";
import ReactMarkdown from "react-markdown";

interface ContentsProps {
  lectureId: string | undefined;
  onQuizComplete?: (contentId: string) => void; // Add this prop
}

export default function Contents({ lectureId, onQuizComplete }: ContentsProps) {
  const [{ data: contents, isPending, isError }] = useAtom(contentsQueryAtom);
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
        return <ReactMarkdown>{currentContent.content}</ReactMarkdown>;
      case 1:
      case 2:
        // Multiple Choice or Short Answer Quiz
        return (
          <ContentQuiz quiz={currentContent} onQuizComplete={onQuizComplete} />
        );
      default:
        return <p>Unknown content type.</p>;
    }
  };

  return (
    <Card className="p-8 mb-8 z-0 w-full bg-gray-950/5 shadow-2xl">
      {renderContent()}
    </Card>
  );
}
