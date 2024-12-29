import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helper/cloudinary.js";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../store_redux/userSlice.js";
import { useDispatch } from "react-redux";

const register = () => {
  const dispatch = useDispatch();

  // States for form data
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const [photo, setPhoto] = useState(null);
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

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const upload = await uploadFile(file);
    setPhoto(file);
    setData((previous) => {
      return {
        ...previous,
        profile_pic: upload?.url,
      };
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;
    try {
      const response = await axios.post(URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.success) {
        const userData = {
          _id: response?.data?.data?._id,
          name: response?.data?.data?.name,
          email: response?.data?.data?.email,
          profile_pic: response?.data?.data?.profile_pic,
        }; 
        dispatch(setUser(userData));
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });
        navigate("/email");
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  // Styling
  return (
    <div className="mt-5 justify-center items-center flex ">
      <div className="w-full bg-white rounded-md overflow-hidden p-8 mx-2 max-w-sm block shadow-md md:mx-auto">
        <h1 className="items-center justify-center flex">
          Welcome to the Chit Chat App
        </h1>
        <form onSubmit={handleSubmitForm}>
          <div className="flex flex-col gap-1 py-3 ">
            <label htmlFor="name" className="block">
              Name:
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-primary block"
              value={data.name}
              onChange={handleChangeData}
              required
            />
          </div>
          <div className="flex flex-col gap-1 py-3">
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
              value={data.email}
              onChange={handleChangeData}
              required
            />
          </div>
          <div className="flex flex-col gap-1 py-3">
            <label htmlFor="password" className="block">
              Password:
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your Password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary block"
              value={data.password}
              onChange={handleChangeData}
              required
            />
          </div>
          <div className="flex flex-col gap-1 py-3">
            <label htmlFor="profile_pic" className="block">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center cursor-pointer border text-black hover:border-primary rounded">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {photo?.name ? photo?.name : "Upload your Profile Photo"}
                  {photo?.name && (
                    <button
                      className="ml-2 text-lg hover:text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        setPhoto(null);
                      }}
                    >
                      <IoClose />
                    </button>
                  )}
                </p>
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="text-white w-full bg-primary text-md rounded-md px-4 py-4 hover:bg-secondary ">
            Register
          </button>
        </form>
        <p className="p-4 w-full">
          Already have an account ?{" "}
          <Link
            to="/email"
            className="text-black hover:text-primary hover:underline"
          >
            {" "}
            Login{" "}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default register;
