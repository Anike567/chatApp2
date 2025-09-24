import React, { useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../store/authContext";

export default function Logout() {
    const { authData, setAuthData } = useContext(AuthContext);
    const { user } = authData;
    const logoutDate = new Date();
    useEffect(() => {
        localStorage.clear();
        setTimeout(() => {
            setAuthData({
                isLoggedIn: false,
                user: null,
                token: null,
            })
        }, 3000)
    }, []);

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <div className="text-center text-black">
                <p className="text-lg font-semibold">Logout Successfully</p>
                <MdCheckCircle size={100} color="red" className="mx-auto my-4" />

                <p>{user?.name}</p>
                <p>{user?.email}</p>
                <p>{`Logout Date : ${logoutDate.toLocaleDateString()}`}</p>
                <p>{`Logout Time : ${logoutDate.toLocaleTimeString()}`}</p>
            </div>
        </div>
    );
}
