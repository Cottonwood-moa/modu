export default function ProfileSkeleton() {
  return (
    <div className=" flex  w-full flex-col items-center space-y-12">
      <div className="mt-12 flex w-[50rem] items-center justify-between text-4xl font-bold text-gray-800">
        <div className="h-16 w-32 rounded-xl bg-gradient-to-r from-gray-300 to-gray-100"></div>
      </div>
      <div className="flex w-[50rem] items-center space-x-12">
        <div className="h-32 w-32 cursor-pointer rounded-full bg-gradient-to-r from-gray-300 to-gray-100" />
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-xl bg-gradient-to-r from-gray-300 to-gray-100 text-2xl font-bold"></div>
          <div className="flex h-8 w-96  space-x-4 rounded-xl bg-gradient-to-r from-gray-300 to-gray-100 text-lg font-medium"></div>
          <div className="h-8 w-[30rem] rounded-xl bg-gradient-to-r from-gray-300 to-gray-100"></div>
        </div>
      </div>
      <div className="w-[50rem] bg-gradient-to-r from-gray-300 to-gray-100 text-4xl font-bold"></div>
      <div className="grid grid-cols-3 gap-2 ">
        {[1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <div
              key={index}
              className="group relative flex h-[17rem] w-[17rem] cursor-pointer items-center justify-center rounded-md bg-gradient-to-r from-gray-300 to-gray-100 p-4  "
            ></div>
          );
        })}
      </div>
    </div>
  );
}
