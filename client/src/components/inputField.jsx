import { IoSend } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { LuImages } from "react-icons/lu";
import { MdVideoCameraBack } from "react-icons/md";
import { useState } from "react";
import uploadFile from "../helper/cloudinary.js";
import Loading from "./loading.jsx";

const inputField = () => {
    const [mediaOpen, setMediaOpen] = useState(false);
    const [loading, setLoading] = useState(false);

  const handleMediaOpen = () => {
    setMediaOpen((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const upload = await uploadFile(file);
    setLoading(false);
    setMediaOpen(false);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: upload?.url,
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const upload = await uploadFile(file);
    setLoading(false);
    setMediaOpen(false);
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: upload?.url,
      };
    });
  };
  const handleInput = (e) => {
    const { value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (connection) {
        connection.emit("new message", {
          sender: user?._id,
          reciever: params?.userId,
          text: message?.text,
          imageUrl: message?.imageUrl,
          videoUrl: message?.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <section className="bg-white border-t p-3 sticky bottom-0">
      <div className="flex items-center gap-3">
        {/* Menu section  */}
        <div>
          {/* for images and videos  */}
          {mediaOpen && (
            <div className="bg-white shadow rounded absolute bottom-24 w-36 p-3">
              <form>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-2 hover:bg-slate-300 hover:rounded-md hover:cursor-pointer"
                >
                  <div className="text-purple-400">
                    <MdVideoCameraBack size={30} />
                  </div>
                  <p>Videos</p>
                </label>
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
                <label
                  htmlFor="uploadPhoto"
                  className="flex items-center p-2 gap-2 hover:bg-slate-300 hover:rounded-md hover:cursor-pointer"
                >
                  <div className="text-primary">
                    <LuImages size={30} />
                  </div>
                  <p>Images</p>
                </label>
                <input
                  type="file"
                  id="uploadPhoto"
                  onChange={handleUploadImage}
                  className="hidden"
                />
              </form>
            </div>
          )}
          <button
            onClick={handleMediaOpen}
            className="border rounded-3xl bg-primary text-slate-200 hover:bg-secondary hover:text-white"
          >
            <MdAdd size={40} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="h-full gap-4 w-full flex justify-between items-center"
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow px-4 py-4 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
            value={message?.text}
            onChange={handleInput}
          />
          <button className="bg-primary text-white px-2 lg:px-4 py-2 rounded-lg hover:bg-secondary">
            <IoSend size={30} />
          </button>
        </form>
      </div>
    </section>
  );
};

export default inputField;
