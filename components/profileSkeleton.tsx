export default function ProfileSkeleton() {
  return (
    <div className=" flex  w-full flex-col items-center space-y-12">
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
