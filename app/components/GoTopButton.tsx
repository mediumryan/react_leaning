import { Button } from './ui/button';
import { ArrowUp } from 'lucide-react';

export default function GoTopButton() {
  const handleClick = () => {
    const parent = document.getElementById('content-scroll');
    if (parent) {
      parent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Button
      className="rounded-[50%] fixed bottom-8 right-8 p-3 z-50"
      onClick={handleClick}
    >
      <ArrowUp />
    </Button>
  );
}
