import { Button } from '~/components/ui/button';
import type { Route } from './+types/home';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/contents/1');
  };

  return (
    <Button variant="default" onClick={handleClick}>
      Hello, world!
    </Button>
  );
}
