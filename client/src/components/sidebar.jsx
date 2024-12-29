import { BsChatDotsFill } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { LuImages } from "react-icons/lu";
import { MdVideoCameraBack } from "react-icons/md";
import { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import Avator from "./avator.jsx";
import EditUserOpen from "./editUserOpen.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import SearchUser from "./searchUser.jsx";

const sidebar = () => {
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [searchUser, setSearchUser] = useState(false);
  const user = useSelector((state) => state?.user);
  const connection = useSelector((state) => state?.user?.socketConnection);
  const navigate = useNavigate();

  useEffect(() => {
    if (connection) {
      connection.emit("sidebar", user?._id);

      connection.on("conversation", async (data) => {
        const conversationUser = data.map((conversation, index) => {
          if (conversation?.sender?._id === conversation?.reciever?._id) {
            return {
              ...conversation,
              userDetails: conversation?.sender,
            };
          } else if (conversation?.reciever?._id !== user?._id) {
            return {
              ...conversation,
              userDetails: conversation?.reciever,
            };
          } else {
            return {
              ...conversation,
              userDetails: conversation?.sender,
            };
          }
        });
        setAllUser(conversationUser);
      });
    }
  }, [connection, user]);

  const handleLogout = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/logout`,
        withCredentials: true,
      });

      if (response?.data?.logout) {
        navigate("/email");
      }

      toast.loading("Wait for Logout", { duration: 3000 });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="w-full h-full bg-slate-400 flex">
      <div className="bg-slate-200 h-full w-12 rounded-tr-lg rounded-br-lg py-5 flex justify-between flex-col items-center ">
        <div className="space-y-3">
          <NavLink
            title="Chat"
            className={({ isActive }) =>
              `w-12 h-12 justify-center items-center flex hover:bg-slate-400 cursor-pointer rounded-full ${
                isActive && "bg-slate-200 "
              }`
            }
          >
            <BsChatDotsFill size={23} />
          </NavLink>
          <NavLink
            title="Search friends"
            className={`w-12 h-12 justify-center items-center flex hover:bg-slate-400 cursor-pointer rounded-full`}
            onClick={() => setSearchUser(true)}
          >
            <FaUserFriends size={23} />
          </NavLink>
        </div>
        <div className="space-y-2 ">
          <button
            title={user?.name}
            className="mx-auto w-12 h-12 justify-center items-center flex hover:bg-slate-400 cursor-pointer rounded-full"
            onClick={() => setEditUserOpen(true)}
          >
            <Avator
              width={30}
              height={30}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="Logout"
            className="w-12 h-12 justify-center items-center flex hover:bg-slate-400 cursor-pointer rounded-full"
            onClick={handleLogout}
          >
            <TbLogout2 size={20} />
          </button>
        </div>
      </div>

      <div className="w-full bg-white rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg">
        <div className="border rounded-br-2xl rounded-bl-2xl rounded-tr-lg rounded-tl-lg">
          <h2 className="px-3 py-5 font-semibold text-2xl text-center">
            Messages
          </h2>
        </div>
        <div className="flex flex-col h-[92vh] overflow-y-auto overflow-x-hidden scrollbar">
          {allUser.length === 0 && (
            <div className="m-2">
              <div className="flex justify-center items-center mt-8 text-slate-400">
                <TiArrowBackOutline size={35} />
              </div>
              <p className="text-lg text-center mt-8 text-slate-400">
                Explore Users for Conversation here.
              </p>
            </div>
          )}

          {allUser.map((curr) => {
            return (
              <NavLink
                to={`/` + curr?.userDetails?._id}
                key={curr?._id}
                className="flex items-center border rounded-2xl hover:border-secondary bg-slate-50 pb-2 gap-2 cursor-pointer"
              >
                <div className="pt-2 px-1">
                  <Avator
                    imageUrl={curr?.userDetails?.profile_pic}
                    name={curr?.userDetails?.name}
                    width={50}
                    height={50}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-sm">
                    {curr?.userDetails?.name}
                  </h3>
                  <div className="text-xs flex gap-1 text-slate-600">
                    <div>
                      {curr?.lastMsg?.imageUrl && (
                        <div className="flex gap-1 items-center">
                          <span>
                            {" "}
                            <LuImages />
                          </span>
                          {!curr?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {curr?.lastMsg?.videoUrl && (
                        <div className="flex gap-1 items-center">
                          <span className="text-purple-700">
                            {" "}
                            <MdVideoCameraBack />
                          </span>
                          {!curr?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {curr?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(curr?.unseenMsg) && (
                  <div className=" text-primary">
                    <p className="text-xs font-semibold">{curr?.unseenMsg}</p>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Edit User Details */}
      {editUserOpen && (
        <EditUserOpen onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search User detail  */}
      {searchUser && <SearchUser onClose={() => setSearchUser(false)} />}
    </div>
  );
};

export default sidebar;
