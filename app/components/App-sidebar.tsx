import { BookOpen, PlayCircle, CheckCircle2 } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Link } from 'react-router';
import { Progress } from './ui/progress';
import { useEffect, useState } from 'react';
import { classAtom, CONTENT_DATA, contentStatusAtom } from '~/data/data';
import { useAtom, useAtomValue } from 'jotai';

// 강의 데이터 예시
const lectureGroups = [
  {
    title: 'Section 1 : Reactの基礎理解',
    items: [
      {
        title: 'Reactとは何か？',
        url: '/contents/1',
        icon: PlayCircle,
      },
      {
        title: 'Reactを使う理由',
        url: '/contents/2',
        icon: PlayCircle,
      },
      {
        title: '開発環境の準備',
        url: '/contents/3',
        icon: PlayCircle,
      },
    ],
  },
  {
    title: 'Section 2 : Reactの基本構文',
    items: [
      {
        title: 'Create React Appでプロジェクト作成',
        url: '/contents/4',
        icon: PlayCircle,
      },
      {
        title: 'JSXとは？',
        url: '/contents/5',
        icon: PlayCircle,
      },
      {
        title: 'コンポーネントの作成',
        url: '/contents/6',
        icon: PlayCircle,
      },
    ],
  },
  {
    title: 'Section 3 : PropsとState',
    items: [
      {
        title: 'Propsの使い方',
        url: '/contents/7',
        icon: PlayCircle,
      },
      {
        title: 'Stateとは？',
        url: '/contents/8',
        icon: PlayCircle,
      },
      {
        title: 'ミニプロジェクト：カウンターアプリ',
        url: '/contents/9',
        icon: PlayCircle,
      },
    ],
  },
  {
    title: 'Section 4 : イベントとフォーム処理',
    items: [
      {
        title: 'イベントハンドリング',
        url: '/contents/10',
        icon: PlayCircle,
      },
      {
        title: 'フォーム入力の管理',
        url: '/contents/11',
        icon: PlayCircle,
      },
      {
        title: 'ミニプロジェクト：簡単なメモアプリ',
        url: '/contents/12',
        icon: PlayCircle,
      },
    ],
  },
  {
    title: 'Section 5 : Todo Listアプリ制作',
    items: [
      {
        title: 'Todo Listの設計',
        url: '/contents/13',
        icon: PlayCircle,
      },
      {
        title: 'Todoの追加と表示',
        url: '/contents/14',
        icon: PlayCircle,
      },
      {
        title: 'Todoの削除と完了処理',
        url: '/contents/15',
        icon: PlayCircle,
      },
      {
        title: '最終確認とまとめ',
        url: '/contents/16',
        icon: PlayCircle,
      },
    ],
  },
];

export function AppSidebar() {
  const [progress, setProgress] = useState(0);

  const grade = useAtomValue(classAtom);
  const [contentStatus, setContentStatus] = useAtom(contentStatusAtom);

  useEffect(() => {
    const dataLength = contentStatus.length;
    const completedLength = contentStatus.filter(
      (a) => a.isComplete === true,
    ).length;
    const calculatedProgress = Math.floor((completedLength / dataLength) * 100);
    const timer = setTimeout(() => setProgress(calculatedProgress), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Sidebar className="">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold tracking-tight">
          React {grade} Class
        </h2>

        <div className="flex items-center gap-2">
          <Progress value={progress} className="w-[60%]" />
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {lectureGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center">
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
