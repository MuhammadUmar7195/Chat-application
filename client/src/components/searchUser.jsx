import Card from "../components/userSearchCard.jsx";
import { TailSpin } from "react-loader-spinner";
import { MdOutlineClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // handle function
  const handleSearchUser = async () => {
    if (!search.trim()) {
      return;
    }
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
      setLoading(true);
      const response = await axios({
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        url: URL,
        data: { search },
      });

      setSearchUser(response?.data?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // Trigger the search function only when the search term changes
  useEffect(() => {
    handleSearchUser();
  }, [search]);

  return (
    <div className="fixed right-0 left-0 top-0 bottom-0 bg-slate-500 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        {/* Input User Search */}
        <div className="bg-white h-14 rounded overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name..."
            className="w-full outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="flex items-center justify-center cursor-pointer">
            <CiSearch size={25} />
          </div>
        </div>

        {/* Display User or No User Found */}
        <div className="w-full mt-2 p-4 rounded bg-slate-100">
          {/* Show loading spinner when loading */}
          {loading && (
            <div className="flex justify-center">
              <TailSpin
                visible={true}
                height="30"
                width="30"
                color="#00acb4"
                ariaLabel="tail-spin-loading"
                radius="1"
              />
            </div>
          )}

          {/* Show no user found message when no users match the search */}
          {!loading && searchUser.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No user found</p>
          )}

          {/* Display the users if available */}
          {!loading && searchUser.length > 0 && (
            <div>
              {searchUser.map((user) => (
                <Card key={user._id} user={user} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* close icon  */}
      <div className="absolute right-0 top-0 text-lg m-2 lg:text-4xl lg:mr-12  hover:text-white cursor-pointer">
        <button
          onClick={onClose}
          className="border border-b-0 border-t-0 rounded-lg items-center hover:border-primary"
        >
          <MdOutlineClose size={30} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
