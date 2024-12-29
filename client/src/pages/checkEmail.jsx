import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { HiUserCircle } from "react-icons/hi2";

const checkEmail = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

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

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;
    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setData({
          email: "",
        });

        navigate("/password", {
          state: response?.data?.data,
        });
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };
  return (
    <div className="mt-5 justify-center items-center flex ">
      <div className="w-full bg-white rounded-md overflow-hidden p-8 mx-2 max-w-sm block shadow-md md:mx-auto">
        <div className="justify-center items-center flex py-6  ">
          <HiUserCircle size={120} />
        </div>
        <h1 className="items-center justify-center flex py-6">
          Welcome to the Chit Chat App
        </h1>
        <form onSubmit={handleSubmitForm}>
          <div className="flex flex-col gap-1 py-6">
            <label htmlFor="Email" className="block">
              Email:
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary block"
              onChange={handleChangeData}
              required
            />
          </div>
          <button className="text-white w-full bg-primary text-md rounded-md px-4 py-4 hover:bg-secondary ">
            Let's Go
          </button>
        </form>
        <p className="p-4 w-full py-6">
          If you are new user ?{" "}
          <Link
            to="/register"
            className="text-black hover:text-primary hover:underline"
          >
            {" "}
            Register{" "}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default checkEmail;
