import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import nord from "react-syntax-highlighter/dist/cjs/styles/prism/nord";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function TestPage() {
  const markdown =
    '\nJSX는 자바스크립트 코드 안에서 **HTML처럼 보이는 문법**을 쓰는 것입니다.\n\n```jsx\nconst element = <h1 className="title">반가워요</h1>;\n```\n\n- HTML과 비슷하지만 `class` 대신 `className`을 씁니다.\n- `{ }`를 사용하면 자바스크립트 변수를 HTML 안에 넣을 수 있습니다.';

  return (
    <div className="h-screen flex flex-col justify-center items-center p-8">
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                // 코드 (```)
                <SyntaxHighlighter
                  style={nord}
                  language={match[1]}
                  PreTag="div"
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
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            },
            // 인용문 (>)
            blockquote({ children, ...props }) {
              return (
                <blockquote
                  style={{
                    background: "#7afca19b",
                    padding: "1px 15px",
                    borderRadius: "10px",
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
                  style={{ maxWidth: "40vw" }}
                  src={props.src?.replace("../../../../public/", "/")}
                  alt="MarkdownRenderer__Image"
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
          {markdown
            .replace(/\n/gi, "\n\n")
            .replace(/\*\*/gi, "@$_%!^")
            .replace(/@\$_%!\^/gi, "**")
            .replace(/<\/?u>/gi, "*")}
        </ReactMarkdown>
      </div>
    </div>
  );
}
