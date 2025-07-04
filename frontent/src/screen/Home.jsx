import React, { use, useEffect, useState } from 'react'
import Loader from '../components/Loader';
import axios from 'axios';

export default function Home() {
    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);


    const fetchUser = async () => {
        try {
            const res = await axios.get("https://randomuser.me/api/?results=50");
            const users = res.data.results;
            setUserList(users);
            setLoading(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => { fetchUser() }, [])



    if (isLoading) {
        return (
            <Loader />
        )
    }
    return (
        <div className="flex h-full w-full items-center justify-center">
            {/* Left sidebar with user list */}
            <div className="w-full sm:w-[20%] h-full overflow-auto p-5 bg-gray-100">
                {userList.map((user, index) => (
                    <div
                        key={index}
                        className="bg-blue-300 my-5 p-4 rounded-lg flex items-center justify-center"
                    >
                        <p className="text-center font-medium">
                            {`${user.name.title} ${user.name.first} ${user.name.last}`}
                        </p>
                    </div>
                ))}
            </div>

            {/* Right panel */}
            <div className="w-[40%] bg-gray-100 h-full"></div>
        </div>
    )

}
