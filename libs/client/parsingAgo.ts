export default function ParsingAgo(time: any) {
  const created = Date.now() - Date.parse(time as unknown as string);
  const month = Math.floor(created / (1000 * 60 * 60 * 24 * 30));
  const day = Math.floor(created / (1000 * 60 * 60 * 24));
  const hour = Math.floor(created / (1000 * 60 * 60));
  const min = Math.floor(created / (1000 * 60));
  if (hour === 0) return `${min}분 전`;
  if (day === 0) return `${hour}시간 전`;
  if (month === 0) return `${day}일 전`;
  else return `${month}달 전`;
}
