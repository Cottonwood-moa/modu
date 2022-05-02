import { atom } from "recoil";

export const darkModeAtom = atom({
  key: "darkModeAtom",
  default: true,
});

export const pageAtom = atom({
  key: "currentPage",
  default: 1,
});

export const searchAtom = atom({
  key: "searchAtom",
  default: "",
});
export enum OrderBy {
  "favs" = "favs",
  "latest" = "latest",
}
export const orderAtom = atom({
  key: "currentOrderBy",
  default: OrderBy.favs,
});
