import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { useAtom, useAtomValue } from 'jotai';
import ContentQuiz from './ContentQuiz';
import { contentsQueryAtom, type Content } from '~/data/contentData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import nord from 'react-syntax-highlighter/dist/cjs/styles/prism/nord';
import remarkGfm from 'remark-gfm';

interface ContentsProps {
  lectureId: string | undefined;
  onQuizComplete?: (contentId: string) => void; // Add this prop
}

export default function Contents({ lectureId, onQuizComplete }: ContentsProps) {
  // const [{ data: contents }] = useAtom(contentsQueryAtom);
  const contents = useAtomValue(contentsQueryAtom);
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
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1({ children, ...props }) {
                return (
                  <h1
                    className="text-2xl font-bold mb-6 text-blue-500"
                    {...props}
                  >
                    {children}
                  </h1>
                );
              },
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <SyntaxHighlighter
                    style={nord}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children)
                      .replace(/\n$/, '')
                      .replace(/\n&nbsp;\n/g, '')
                      .replace(/\n&nbsp\n/g, '')}
                  </SyntaxHighlighter>
                ) : (
                  <SyntaxHighlighter
                    style={nord}
                    background="green"
                    language="textile"
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                );
              },
              blockquote({ children, ...props }) {
                return (
                  <blockquote
                    style={{
                      background: '#deeaff',
                      padding: '1px 15px',
                      borderRadius: '10px',
                    }}
                    {...props}
                  >
                    {children}
                  </blockquote>
                );
              },
              img({ ...props }) {
                return (
                  <img
                    style={{ maxWidth: '40vw' }}
                    src={props.src?.replace('../../../../public/', '/')}
                    alt="MarkdownRenderer__Image"
                  />
                );
              },
              em({ children, ...props }) {
                return (
                  <span style={{ fontStyle: 'italic' }} {...props}>
                    {children}
                  </span>
                );
              },
            }}
          >
            {currentContent.content.replace(/\n/gi, '\n\n')}
          </ReactMarkdown>
        );
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
    <Card
      id="content-scroll-inner"
      className="p-8 mb-8 z-0 w-full bg-gray-950/5 shadow-2xl"
    >
      {renderContent()}
    </Card>
  );
}
