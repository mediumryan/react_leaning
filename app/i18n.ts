import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ko: {
    translation: {
      common: {
        add: '추가',
        delete: '삭제',
        save: '저장',
        cancel: '취소',
        change: '변경',
        edit: '수정',
        register: '등록',
      },
      lecture: {
        complete_button: '강의 완료하기',
        complete_alert: '이 강의를 완료했습니다!',
        fail_alert: '강의 완료 처리에 실패했습니다.',
        already_done: '이미 완료한 강의입니다.',
      },
      home_message: {
        welcome: '환영합니다!',
        go_to_lecture: '학습하러 가기',
        go_to_community: '커뮤니티',
      },
      notice: {
        notice_add: '공지사항 작성',
        notice_edit: '공지사항 수정',
        notice_delete: '공지사항 삭제',
        notice_title: '제목',
        notice_title_detail: '공지사항 제목을 입력해주세요.',
        notice_content: '내용',
        notice_content_detail: '공지사항 내용을 입력해주세요.',
        notice_important: '중요',
        notice_empty: '등록된 공지사항이 없습니다.',
        notice_delete_confirm: '이 공지사항을 삭제하시겠습니까?',
        notice_add_success: '공지사항이 등록되었습니다.',
        notice_add_fail: '공지사항 등록에 실패했습니다.',
        notice_edit_success: '공지사항이 수정되었습니다.',
        notice_edit_fail: '공지사항 수정에 실패했습니다.',
        notice_delete_success: '공지사항이 삭제되었습니다.',
        notice_delete_fail: '공지사항 삭제에 실패했습니다.',
      },
      auth: {
        login: '로그인',
        logout: '로그아웃',
        welcome: '환영합니다, {{name}}님!',
      },
      course: {
        Beginner: 'Beginner - 초심자 코스',
        Intermediate: 'Intermediate - 중급자 코스（준비중）',
        Advanced: 'Advanced - 상급자 코스（준비중）',
      },
    },
  },
  ja: {
    translation: {
      common: {
        add: '追加',
        delete: '削除',
        save: '保存',
        cancel: 'キャンセル',
        change: '変更',
        edit: '修正',
        register: '登録',
      },
      lecture: {
        complete_button: 'レクチャーを完了する',
        complete_alert: 'このレクチャーを完了しました！',
        fail_alert: 'レクチャーの完了に失敗しました。',
        already_done: '既に完了したレクチャーです。',
      },
      home_message: {
        welcome: 'ようこそ！',
        go_to_lecture: 'React学習へ',
        go_to_community: 'コミュニティ',
      },
      notice: {
        notice_add: 'お知らせを作成',
        notice_edit: 'お知らせを編集',
        notice_delete: 'お知らせを削除',
        notice_title: 'タイトル',
        notice_title_detail: 'お知らせのタイトルを入力してください。',
        notice_content: '内容',
        notice_content_detail: 'お知らせの内容を入力してください。',
        notice_important: '重要',
        notice_empty: '登録されているお知らせはありません。',
        notice_add_success: 'お知らせが登録されました。',
        notice_add_fail: 'お知らせの登録に失敗しました。',
        notice_edit_success: 'お知らせが修正されました。',
        notice_edit_fail: 'お知らせの修正に失敗しました。',
        notice_delete_confirm: 'このお知らせを削除しますか？',
        notice_delete_success: 'お知らせが削除されました。',
        notice_delete_fail: 'お知らせの削除に失敗しました。',
      },
      auth: {
        login: 'ログイン',
        logout: 'ログアウト',
        welcome: 'ようこそ、{{name}}さん！',
      },
      course: {
        Beginner: 'Beginner - 初心者コース',
        Intermediate: 'Intermediate - 中級者コース（準備中）',
        Advanced: 'Advanced - 上級者コース（準備中）',
      },
    },
  },
};

// 2. i18next 설정 초기화
i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next) // react-i18next와 연결
  .init({
    resources,
    fallbackLng: 'ko', // 일치하는 언어가 없을 경우 기본값
    debug: false,
    interpolation: {
      escapeValue: false, // 리액트는 자체적으로 XSS 방지를 하므로 false
    },
  });

export default i18n;
