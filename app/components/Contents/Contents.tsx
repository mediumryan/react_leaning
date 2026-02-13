// react
import { useMemo } from "react";
// atoms
import { useAtomValue } from "jotai";
import { contentsAtom } from "~/data/contentData";
// shadcn/ui
import { Card } from "../ui/card";
// components
import ContentQuiz from "./ContentQuiz";
// markdown
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import nord from "react-syntax-highlighter/dist/cjs/styles/prism/nord";
import remarkGfm from "remark-gfm";

interface ContentsProps {
  lectureId: string | undefined;
}

export default function Contents({ lectureId }: ContentsProps) {
  const contents = useAtomValue(contentsAtom);

  const currentContent = useMemo(() => {
    return contents?.find((item) => item.id === lectureId) ?? null;
  }, [contents, lectureId]);

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
              strong({ children, ...props }) {
                return (
                  <strong
                    className="font-extrabold text-gray-900 mx-0.5"
                    {...props}
                  >
                    {children}
                  </strong>
                );
              },
              p({ children }) {
                return (
                  <p className="leading-7 whitespace-pre-wrap">{children}</p>
                );
              },
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
              h3({ children, ...props }) {
                return (
                  <h3 className="text-xl font-bold" {...props}>
                    {children}
                  </h3>
                );
              },
              code({ className, children }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={nord}
                    language={match[1]}
                    PreTag="pre"
                  >
                    {String(children)
                      .replace(/\n$/, "")
                      .replace(/\n&nbsp;\n/g, "")
                      .replace(/\n&nbsp\n/g, "")}
                  </SyntaxHighlighter>
                ) : (
                  <SyntaxHighlighter
                    style={nord}
                    background="green"
                    language="textile"
                    PreTag="pre"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              },
              blockquote({ children, ...props }) {
                return (
                  <blockquote
                    style={{
                      background: "#deeaff",
                      padding: "1px 15px",
                      borderRadius: "10px",
                    }}
                    {...props}
                  >
                    {children}
                  </blockquote>
                );
              },
              img({ node, ...props }) {
                return (
                  <img
                    {...props}
                    className="rounded-lg shadow-md my-6"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      display: "block",
                      margin: "1.5rem auto",
                    }}
                    alt={props.alt || "content-image"}
                    src={props.src}
                  />
                );
              },
              em({ children, ...props }) {
                return (
                  <span style={{ fontStyle: "italic" }} {...props}>
                    {children}
                  </span>
                );
              },
            }}
          >
            {currentContent.content}
          </ReactMarkdown>
        );
      case 1:
      case 2:
        // Multiple Choice or Short Answer Quiz
        return <ContentQuiz quiz={currentContent} />;
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
