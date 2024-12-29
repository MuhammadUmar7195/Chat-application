import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Avator from "../components/avator.jsx";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../store_redux/userSlice.js";

const checkPassword = () => {
  const [data, setData] = useState({
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, [location?.state?.name, navigate]);

  // Handle change functions
  const handleChangeData = (e) => {
    const { name, value } = e.target;

    setData((previous) => {
      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const dataToSend = {
      password: data?.password,
      userId: location?.state?._id,
    };

    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;
      const response = await axios.post(URL, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      if (response?.data?.success) {        
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);

        setData({ password: "" });
        navigate("/");
      }

      toast.success(response?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="mt-5 justify-center items-center flex ">
      <div className="w-full bg-white rounded-md overflow-hidden p-8 mx-2 max-w-sm block shadow-md md:mx-auto">
        <div className="w-fit mx-auto mb-2">
          <Avator
            width={120}
            height={120}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <div className="text-center justify-center flex content-center">
            <h2 className="mt-3 text-lg font-semibold">
              {location?.state?.name}
            </h2>
          </div>
        </div>
        <h1 className="items-center justify-center flex py-6">
          Welcome to the Chit Chat App
        </h1>
        <form onSubmit={handleSubmitForm}>
          <div className="flex flex-col gap-1 py-6">
            <label htmlFor="Email" className="block">
              Password:
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary block"
              onChange={handleChangeData}
              required
            />
          </div>
          <button className="text-white w-full bg-primary text-md rounded-md px-4 py-4 hover:bg-secondary ">
            Login
          </button>
        </form>
        <p className="p-4 w-full py-6">
          {" "}
          <Link
            to="/forget-password"
            className="text-black flex justify-center items-center hover:text-primary hover:underline"
          >
            {" "}
            Forget Password ?{" "}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default checkPassword;
