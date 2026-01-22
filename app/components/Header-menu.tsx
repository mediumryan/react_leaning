import { BookOpen, House, LogOut, UsersRound } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { useNavigate } from 'react-router';

export function HeaderMenu() {
  const navigate = useNavigate();

  const handleClickNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  const handleClickSignOut = () => {
    // 여기에 로그아웃 로직 추가
    console.log('로그아웃 처리');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="fixed top-3 right-4 w-10 h-10 cursor-pointer z-50">
          <AvatarFallback className="bg-black text-white select-none">
            <span className="">RY</span>
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 items-center justify-center w-12">
        <House onClick={() => handleClickNavigate('')} />
        <BookOpen onClick={() => handleClickNavigate('contents/1')} />
        <UsersRound onClick={() => handleClickNavigate('users')} />
        <LogOut onClick={handleClickSignOut} />
      </PopoverContent>
    </Popover>
  );
}
