import Avator from "./avator.jsx";
import { Link } from "react-router-dom";

const userSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/${user?._id}`}
      onClick={onClose} 
      className="flex items-center gap-3 p-2.5 lg:p-4 border border-transparent border-b-slate-300 rounded-md hover:border hover:border-primary cursor-pointer"
    >
      <div className="m-1">
        <Avator width={60} height={60} name={user?.name} userId={user?._id} imageUrl={user?.profile_pic}/>
      </div>

      <div>
        <div className="font-semibold text-lg text-ellipsis line-clamp-1 ">
          {user?.name}
        </div>
        <p className="text-sm text-ellipsis line-clamp-1 ">{user?.email}</p>
      </div>
    </Link>
  );
};

export default userSearchCard;
