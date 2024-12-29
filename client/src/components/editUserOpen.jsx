import { useState, useEffect, useRef } from "react";
import Avator from "./avator.jsx";
import uploadFile from "../helper/cloudinary.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../store_redux/userSlice.js";

const EditUserModal = ({ onClose, user }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });
  const uploadPhotoRef = useRef();

  useEffect(() => {
    if (user) {
      setData({
        name: user?.name || "",
        profile_pic: user?.profile_pic || "",
      });
    }
  }, [user]);

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    try {
      const file = e.target.files[0];
      const upload = await uploadFile(file);

      setData((prev) => ({
        ...prev,
        profile_pic: upload?.url,
      }));
      toast.success("Photo updated successfully!");
    } catch (error) {
      toast.error("Failed to upload photo");
    }
  };

  const handleOpenPhoto = () => {
    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;
      const response = await axios({
        method: "post",
        url: URL,
        data: data,
        withCredentials: true
      });

      console.log("User updated successfully:", response);
      toast.success(response?.data?.message || "Profile updated!");
      
      if (response?.data?.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload Photo");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="p-6 w-full max-w-sm bg-white rounded shadow-lg">
        <h2 className="font-semibold text-2xl text-center">Edit Profile</h2>
        <p className="text-center pt-3">Update your profile details</p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center pt-5">
            <label htmlFor="name" className="w-full flex flex-col">
              <span className="mb-2">Name:</span>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Change your name"
                className="bg-slate-100 px-3 py-2 border rounded-md focus:outline-primary"
                value={data.name}
                onChange={handleChangeData}
              />
            </label>
          </div>

          <div className="flex flex-col items-center pt-6">
            <label
              htmlFor="profile_pic"
              className="w-full flex flex-col items-center"
            >
              <span className="mb-2">Photo:</span>
              <div className="m-4">
                <Avator
                  width={50}
                  height={50}
                  imageUrl={data.profile_pic}
                  name={data.name}
                />
              </div>
              <button
                type="button"
                className="text-black hover:text-primary underline text-sm"
                onClick={handleOpenPhoto}
              >
                Change Photo
              </button>
              <input
                type="file"
                id="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </label>
          </div>

          <div className="flex justify-between gap-4 pt-8">
            <button
              type="button"
              className="w-full bg-primaryCancel text-white text-md rounded-md px-4 py-2 hover:bg-secondaryCancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-primary text-white text-md rounded-md px-4 py-2 hover:bg-secondary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
