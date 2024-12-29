import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import SideBar from "../components/sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  setOnlineUser,
  setSocketConnection,
  setUser,
} from "../store_redux/userSlice.js";
import Logo from "../assets/logo.png";
import io from "socket.io-client";

const home = () => {
  const user = useSelector((state) => state?.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchedData = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_BACKEND_URL}/api/user-details`,
        withCredentials: true,
      });

      dispatch(setUser(response?.data?.data));

      if (response?.data?.data?.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchedData();
  }, []);

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketConnection.on("Online User", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const basePath = location.pathname === "/";

  return (
    <div className="">
      <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
        <section className={`bg-slate-200 ${!basePath && "hidden"} lg:block`}>
          <SideBar />
        </section>
        <section className={`${basePath && "hidden"}`}>
          <Outlet />
        </section>

        <div
          className={`justify-center bg-slate-200 items-center max-sm:hidden sm:hidden md:hidden flex-col gap-2 ${
            !basePath ? "hidden" : "lg:flex"
          } `}
        >
          <div className="cursor-pointer">
            <img src={Logo} alt="Logo" width={500} height={300} />
          </div>
          <p className="text-center mt-2 "> Select User to Send Message</p>
        </div>
      </div>
    </div>
  );
};

export default home;
