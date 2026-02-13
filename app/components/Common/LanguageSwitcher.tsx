import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { useSetAtom } from "jotai";
import { languageAtom } from "~/data/contentData";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const setContentsLanguage = useSetAtom(languageAtom);

  // 현재 언어 확인 (버튼 스타일링 등에 활용)
  const currentLanguage = i18n.language;

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setContentsLanguage(lng);
    // 팁: 나중에 여기서 유저 데이터(Firebase)에 선호 언어를 저장하는 로직을 넣으면 딱입니다!
  };

  return (
    <div className="flex space-x-2 items-center justify-center">
      <Button
        variant="outline"
        onClick={() => toggleLanguage("ko")}
        className={`${currentLanguage === "ko" ? "font-bold text-blue-500" : ""}`}
      >
        한국어
      </Button>
      <Button
        variant="outline"
        onClick={() => toggleLanguage("ja")}
        className={`${currentLanguage === "ja" ? "font-bold text-blue-500" : ""}`}
      >
        日本語
      </Button>
    </div>
  );
}
