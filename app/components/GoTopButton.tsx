import { useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import { useParams } from "react-router";

export default function GoTopButton() {
  const lectureId = useParams().id;

  const handleClick = () => {
    const scrollView = document.getElementById("contentScroll");
    if (scrollView) {
      scrollView.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!lectureId) return;
    handleClick();
  }, [lectureId]);

  return (
    <Button
      className="rounded-[50%] fixed bottom-8 right-8 p-3 z-50"
      onClick={handleClick}
    >
      <ArrowUp />
    </Button>
  );
}
