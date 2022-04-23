export default function SkeletonCard() {
  return (
    <div className="aspect-square w-full min-w-[300px] max-w-md space-y-2 rounded-md bg-white p-4 shadow-lg">
      <div className="relative h-[80%] w-full rounded-lg bg-gradient-to-r from-gray-300 to-gray-100"></div>
      <div className="h-4 w-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
      <div className="h-4 w-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
          <div className="h-4 w-24 bg-gradient-to-r from-gray-300 to-gray-100"></div>
        </div>
        <div className="flex space-x-4 ">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-300 to-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
