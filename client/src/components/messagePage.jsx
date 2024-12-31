import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { LuImages } from "react-icons/lu";
import { MdVideoCameraBack } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import Avator from "./avator.jsx";
import uploadFile from "../helper/cloudinary.js";
import Loading from "./loading.jsx";
import moment from "moment";
import wallpaper from "../assets/wallpaper2.jpg";

const messagePage = () => {
  const params = useParams();
  const connection = useSelector((state) => state?.user?.socketConnection);
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [mediaOpen, setMediaOpen] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMsg = useRef();

  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessage]);

  useEffect(() => {
    if (connection) {
      connection.emit("message-page", params?.userId);

      connection.emit("seen", params?.userId);

      connection.on("message-connect", (data) => {
        setDataUser(data);
      });

      connection.on("message", (data) => {
        setAllMessage(data);
      });
    }
  }, [connection, params?.userId, user]);

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

  const handleClearImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };

  const handleClearVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
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
    <div
      style={{ background: `url()` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 z-40 lg:h-20 h-auto border-b bg-slate-300 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to={`/`} className="lg:hidden">
              <IoIosArrowBack size={30} />
            </Link>
            <Avator
              width={75}
              height={75}
              name={dataUser?.name}
              imageUrl={dataUser?.profile_pic}
              userId={dataUser?._id}
            />
            <div>
              <h3 className="lg:text-lg text-base font-semibold">
                {dataUser?.name}
              </h3>
              <p className="flex items-center text-sm lg:text-base">
                {dataUser?.online ? (
                  <span className="text-primary">online</span>
                ) : (
                  <span className="text-slate-400">offline</span>
                )}
              </p>
            </div>
          </div>
          <div className="mr-5">
            <button>
              <HiDotsVertical size={30} />
            </button>
          </div>
        </div>
      </header>

      <div className="h-[90vh] flex flex-col">
        {/* Message Section */}
        <section className="flex-grow bg-slate-300 p-4 overflow-y-scroll scrollbar relative">
          {/* Add your messages here */}
          <div className="flex flex-col gap-2">
            {allMessage.map((msg, index) => (
              <>
                <div
                  className={`${
                    user?._id === msg?.msgByUserId ? "ml-auto" : ""
                  }`}
                  ref={currentMsg}
                >
                  <div className="w-fit h-fit">
                    {msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className="max-w-full max-h-32 object-contain "
                        alt="Message content"
                      />
                    )}
                  </div>
                  <div className="w-fit h-fit">
                    {msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className="max-w-full max-h-32 object-contain "
                        alt="Message content"
                        muted
                        controls
                      />
                    )}
                  </div>
                  <div
                    key={index}
                    className={`bg-white p-2 py-1 rounded-lg shadow-sm w-fit ${
                      user?._id === msg?.msgByUserId ? "bg-teal-300" : ""
                    }`}
                  >
                    <p className="px-2">{msg?.text || msg?.data}</p>
                  </div>
                  <div className="p-2 py-1 text-xs text-black w-fit">
                    <p>{moment(msg?.createdAt).format("hh:mm a")}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
          {/* upload media section */}
          {message?.imageUrl && (
            <div className="sticky bottom-0 top-0 w-full h-full flex justify-center items-center bg-slate-300 overflow-hidden bg-opacity-10">
              <button
                onClick={handleClearImage}
                className="absolute top-2 right-2 md:top-4 md:right-8 lg:top-6 lg:right-10 p-2 bg-white shadow-md hover:bg-red-500 rounded-full cursor-pointer transition-all"
              >
                <IoIosClose size={32} />
              </button>
              <div className="bg-white p-3 bottom-0 shadow-lg rounded-lg">
                <img src={message.imageUrl} height={200} width={200} />
              </div>
            </div>
          )}
          {message?.videoUrl && (
            <div className="sticky bottom-0 top-0 w-full h-full flex justify-center items-center bg-slate-300 overflow-hidden bg-opacity-10">
              <button
                onClick={handleClearVideo}
                className="absolute top-2 right-2 md:top-4 md:right-8 lg:top-6 lg:right-10 p-2 bg-white shadow-md hover:bg-red-500 rounded-full cursor-pointer transition-all"
              >
                <IoIosClose
                  size={24}
                  className="text-gray-700 hover:text-white"
                />
              </button>
              <div className="relative w-[90%] lg:w-[70%] xl:w-[50%] bg-white p-4 shadow-lg rounded-lg">
                <video
                  src={message.videoUrl}
                  className="aspect-video w-full rounded-lg shadow-md"
                  muted
                  autoPlay
                  controls
                />
              </div>
            </div>
          )}
          {/* loading section  */}
          {loading && (
            <div className="h-full w-full sticky bottom-0 flex justify-center items-center">
              <Loading />
            </div>
          )}
        </section>
        {/* Input Section */}
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
      </div>
    </div>
  );
};

export default messagePage;
