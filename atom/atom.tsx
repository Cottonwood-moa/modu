import { atom } from "recoil";

export const pageAtom = atom({
  key: "currentPage",
  default: 1,
});
export enum OrderBy {
  "favs" = "favs",
  "latest" = "latest",
}
export const orderAtom = atom({
  key: "currentOrderBy",
  default: OrderBy.favs,
});
