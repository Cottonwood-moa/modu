export default function numberWithCommas(n: number) {
  return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}
