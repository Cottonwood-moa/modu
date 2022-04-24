import { atom } from "recoil";

export const pageAtom = atom({
  key: "currentPage",
  default: 1,
});
