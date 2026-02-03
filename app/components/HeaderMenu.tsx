// react-router
import { Link, useNavigate } from 'react-router';
// atoms
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom } from '~/data/userData';
import { contentsQueryAtom } from '~/data/contentData';
// icons
import {
  BookOpen,
  House,
  LogOut,
  MessagesSquare,
  UsersRound,
} from 'lucide-react';
// shadcn/ui
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
// helpers
import { getFirstContentId, getUserMedal } from '~/helper/helper';
// firebase
import { logout } from '~/lib/auth';
import { cn } from '~/lib/utils';

export function HeaderMenu() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  // const [{ data: contents }] = useAtom(contentsQueryAtom);
  const contents = useAtomValue(contentsQueryAtom);

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
        <div className="fixed top-3 right-8 w-10 h-10 z-50">
          <Avatar className={cn('w-10 h-10 cursor-pointer border-4')}>
            <AvatarFallback className="bg-black text-white select-none">
              <span className="">
                {currentUser?.name
                  ? currentUser?.name.charAt(0).toUpperCase()
                  : '?'}
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
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
        <Link to="/test" className="mt-2 text-sm text-gray-500">
          TEST
        </Link>
        {currentUser && (
          <img
            src={getUserMedal(currentUser.grade)}
            alt="user medal"
            className="min-w-40 h-20 absolute -bottom-20"
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
