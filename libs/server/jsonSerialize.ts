export default function jsonSerialize<T = any>(arg: T) {
  return JSON.parse(JSON.stringify(arg));
}
