
import React, { useContext } from "react";
import { FiUser } from "react-icons/fi";
import { AuthContext } from "../store/authContext";


export default function Profile() {
    const { user, token } = useContext(AuthContext).authData;
    console.log(user.dp);
    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className=" flex items-center justify-center gap-20 p-20 bg-white">
                <div className="w-20 h-20 cursor-pointer rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.dp ? (
                        (() => {
                            const blob = new Blob([user.dp], { type: "image/png" });
                            const url = URL.createObjectURL(blob);
                            console.log(url);
                            return (
                                <img
                                    src={url}
                                    alt="user dp"
                                    className="w-full h-full object-cover"
                                />
                            );
                        })()
                    ) : (
                        <FiUser size={24} className="text-gray-700" />
                    )}


                </div>

                <div>
                    <div>
                        <p className="text-black">{user.username}</p>
                    </div>
                    <div>
                        <p className="text-black">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-black">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
