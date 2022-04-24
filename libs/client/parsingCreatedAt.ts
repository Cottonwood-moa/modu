export default function ParsingCreatedAt(time: any) {
  const parsed = Date.parse(time as unknown as string);
  const date = new Date(parsed);
  const createdAt = date.toLocaleString();
  return createdAt;
}
