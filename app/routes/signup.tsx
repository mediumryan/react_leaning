import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { signUp } from '~/lib/auth';
import { firestore } from '~/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useAtom } from 'jotai'; // Import useAtomValue
import { contentsQueryAtom } from '~/data/contentData';

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [{ data: contents }] = useAtom(contentsQueryAtom);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!contents) {
      setError('Content data is not yet loaded. Please try again.');
      return;
    }

    try {
      // 1. Firebase Auth에 유저 생성
      const userCredential = await signUp(email, password);
      const user = userCredential.user;

      if (!user) throw new Error('User creation failed');

      // 2. Firestore에 기본 유저 정보 저장 (contentStatus 제외)
      await setDoc(doc(firestore, 'users', user.uid), {
        name: name,
        nickname: nickname,
        email: email,
        course: 'Beginner',
        grade: 'Bronze',
        exp: 0,
        authority: 'user',
      });

      alert('회원가입 및 사용자 정보 저장 성공!');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      alert(`회원가입 실패: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="길동"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">이메일</Label>
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
            <Label htmlFor="password">비밀번호 (6자리 이상)</Label>
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

          <Button type="submit" className="w-full mt-4">
            회원가입
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
