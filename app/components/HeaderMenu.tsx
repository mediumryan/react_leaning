import {
  BookOpen,
  House,
  LogOut,
  MessagesSquare,
  UsersRound,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom } from '~/data/userData';
import { getFirstContentId } from '~/helper/helper';
import { logout } from '~/lib/auth';
import { contentsAtom } from '~/data/contentData';

export function HeaderMenu() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const contents = useAtomValue(contentsAtom);

  const handleClickNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  const handleClickSignOut = () => {
    if (confirm('ログアウトしますか？')) {
      logout();
      setCurrentUser(null);
      navigate('/login');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar className="fixed top-3 right-8 w-10 h-10 cursor-pointer z-50">
          <AvatarFallback className="bg-black text-white select-none">
            <span className="">
              {currentUser?.name
                ? currentUser?.name.charAt(0).toUpperCase()
                : '?'}
            </span>
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 items-center justify-center w-12">
        <House
          className="cursor-pointer"
          onClick={() => handleClickNavigate('')}
        />
        <BookOpen
          className="cursor-pointer"
          onClick={() => {
            const firstContentId = getFirstContentId(contents ?? []);
            handleClickNavigate(`contents/${firstContentId}`);
          }}
        />
        <UsersRound
          className={`${currentUser?.authority === 'user' ? 'hidden' : ''} cursor-pointer`}
          onClick={() => handleClickNavigate('users')}
        />
        <MessagesSquare
          className="cursor-pointer"
          onClick={() => handleClickNavigate('community')}
        />
        <LogOut className="cursor-pointer" onClick={handleClickSignOut} />
      </PopoverContent>
    </Popover>
  );
}
