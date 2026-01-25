import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { H2_STYLE } from '~/components/styleFormat/style';
import { Button } from '~/components/ui/button';
import { ButtonGroup } from '~/components/ui/button-group';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { currentUserAtom } from '~/data/userData';
import { signIn } from '~/lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const currentUser = useAtomValue(currentUserAtom);

  const handleClickSignUp = () => {
    navigate('/signup');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
      alert('ログイン成功!');
    } catch (err: any) {
      setError(err.message);
      alert(`ログイン失敗: ${err.message}`);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-sm shadow-lg">
        <h2 className={H2_STYLE + ' mb-6 text-center'}>ログイン</h2>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">メール</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">パスワード </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <ButtonGroup className="w-full mt-6 flex justify-end">
            <Button type="button" onClick={handleClickSignUp}>
              会員登録
            </Button>
            <Button type="submit" onClick={handleSignIn} variant="outline">
              ログイン
            </Button>
          </ButtonGroup>
        </form>
      </Card>
    </div>
  );
};

export default Login;
