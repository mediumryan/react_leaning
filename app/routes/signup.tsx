// react
import React, { useState } from 'react';
// react-router
import { useNavigate } from 'react-router';
// atoms
import { useAtom } from 'jotai';
// shadcn/ui
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
// firebase
import { signUp } from '~/lib/auth';
import { firestore } from '~/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      alert('サインアップに成功しました！ようこそ！');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      alert(`サインアップに失敗しました: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="REACT TARO"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="React Machine"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>

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
          <Label className="text-red-400 text-xs">
            *必ず実在するメールアドレスを入力してください。
          </Label>
          <div>
            <Label htmlFor="password">Password (6文字以上)</Label>
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
            Submit
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
