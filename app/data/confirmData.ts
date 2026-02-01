import { atom } from "jotai";

export type ConfirmOptions = {
  icon: number;
  message: string;
  size: "sm" | "default";
};

type ConfirmState = {
  open: boolean;
  options: ConfirmOptions;
  resolver?: (value: boolean) => void;
};

export const confirmAtom = atom<ConfirmState>({
  open: false,
  options: {
    message: "",
    icon: 0,
    size: "sm",
  },
});
