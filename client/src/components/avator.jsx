import { HiUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Avator = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  let avatorName = "";

  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avatorName = splitName[0][0] + splitName[1][0];
    } else {
      avatorName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-teal-200",
    "bg-purple-200",
    "bg-cyan-200",
  ];

  // Use `useMemo` to generate the color once
  const randomColor = useMemo(() => Math.floor(Math.random() * bgColor.length), []);

  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className={`text-slate-800 relative overflow-hidden rounded-full shadow-2xl border text-xl font-semibold ${bgColor[randomColor]} flex justify-center items-center`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          width={width}
          height={height}
          className="overflow-hidden rounded-full flex justify-center items-center"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full flex justify-center items-center"
        >
          {avatorName}
        </div>
      ) : (
        <HiUserCircle size={width} />
      )}

      {isOnline && (
        <div className="bg-green-600 w-3 h-3 absolute bottom-0.5 right-0.5 z-50 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default Avator;
