import { AuthContext } from "../store/authContext";
import { useContext, useEffect, useState } from "react";
import SearchResult from "../components/SearchResult";
import { HiDotsVertical } from "react-icons/hi";
import UpdateProfile from "../components/UpdateProfile";
import ForgetPassword from "./../screen/ForgetPassword";
import FriendRequests from "../components/FriendRequests";
import Logout from "../components/Logout";
import Modal from "./../components/Modal";
import { SocketContext } from "../store/socketIdContext";
import Profile from "./Profile";


export default function Header({ friendsList }) {
    const { user, token } = useContext(AuthContext).authData;
    const [showSetting, setShowSetting] = useState(false);
    const [settingOption, setSettingOption] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchRsult, setSearchResult] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selected, setSelected] = useState(null);
    const { socket, socketId } = useContext(SocketContext);



    const menuItems = [
        { id: 1, label: "Profile" },
        { id: 2, label: "Change Profile Picture" },
        { id: 3, label: "Change Password" },
        { id: 4, label: "Friend Requests" },
        { id: 5, label: "Logout" },
    ];

    const settingComponents = {
        1: <Profile />,
        2: <UpdateProfile />,
        3: <ForgetPassword />,
        4: <FriendRequests />,
        5: <Logout user={user} />
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText.trim()) {
                socket.emit("search", searchText.trim(), (result) => {
                    setSearchResult(result);
                });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchText]);
    return (
        <div className="p-5 border-b bg-white shadow-sm">
            <div className="flex justify-between items-center px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
                <HiDotsVertical color="black" size={25} className="cursor-pointer" onClick={() => { setShowSetting((prev) => !prev) }} />
            </div>

            <div className="relative">
                <input
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
                    type="text"
                    placeholder="Search by email or username"
                    className="w-full px-3 py-2 border rounded-lg text-black focus:outline-none"
                />

                {/**
               * 
               * popup for setting 
               * options like upload dp, change dp , delete dp 
               */}

                {showSetting && (
                    <div
                        tabIndex={0}
                        className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-md">
                        <ul className="flex flex-col text-sm text-gray-700">
                            {menuItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={`
            px-4 py-3 cursor-pointer transition-all rounded-md text-lg text-bold
            ${selected === item.id
                                            ? "bg-blue-500 text-white shadow-md"
                                            : "hover:bg-blue-50 hover:shadow-md hover:text-blue-600"
                                        }
          `}
                                    onClick={() => { setSettingOption(item.id); setIsOpen(true) }}
                                    onMouseEnter={() => { setSelected(item.id) }}
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    </div>


                )}
                {settingOption && (
                    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                        {settingComponents[settingOption]}
                    </Modal>
                )}

                {searchText.trim() && searchRsult.length > 0 && (
                    <SearchResult searchRsult={searchRsult} friendList={friendsList} />
                )}


            </div>

        </div>
    )
}
