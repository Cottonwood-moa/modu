interface Props {
  text: string;
}

export default function PageLoading({ text }: Props) {
  return (
    <div className="z-20 flex h-[100vh] w-[100vw] items-center justify-center bg-white text-6xl font-bold text-gray-800">
      {text}
    </div>
  );
}
