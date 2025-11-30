import { useContext, useEffect, useRef, useState, useCallback } from "react";
import Loader from "../components/Loader";
import { SocketContext } from "../store/socketIdContext";
import { AuthContext } from "../store/authContext";
import User from "../components/User";
import Header from "../components/Header";
import Chats from "../components/Chats";

export default function Home() {
  const { user, token } = useContext(AuthContext).authData;
  const { socket, socketId } = useContext(SocketContext);
  const [isLoading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendsList, setFriendList] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [messageList, setMessageList] = useState([]);

  const userStatusRefs = useRef(new Map());

  const handleIncomingMessage = useCallback((data) => {

    if (!selectedUser || data.from !== selectedUser.u__id) {

      setUserList((prevList) => {
        const newUserList = prevList.map(user =>
          user.u__id === data.from
            ? { ...user, msgCount: (user.msgCount || 0) + 1 }
            : user
        )

        newUserList.sort((a, b) => (b.msgCount - a.msgCount));
        return newUserList

      });
      return;
    }

    if (selectedUser.u__id === data.from) {
      setMessageList(prev => [...prev, data]);
    }

  }, [selectedUser]);


  // ✅ Fetch all user statuses (heartbeat)

  const getAllUserStatuses = useCallback(() => {
    if (!userList.length) return;
    const payload = { usersId: userList.map(friend => friend.u__id) };

    socket.emit("heartbeat", payload, (data) => {
      if (data.error) {
        console.error("Heartbeat failed:", data.message);
        return;
      }

      data.data.forEach(status => {
        userStatusRefs.current.set(status.user_id, status);
      });

      if (selectedUser) {
        let newStatus = userStatusRefs.current.get(selectedUser.u__id);

        if (userStatus !== newStatus) {
          setUserStatus(newStatus);
        }
      }
    });
  }, [userList, socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("getuser", { token }, (data) => {
      if (data.error) {
        alert(data.message);
      } else {
        const users = data.message.users;
        userStatusRefs.current = new Map(users.map(friend => [friend.u__id, null]));

        setFriendList(users.map(u => u.u__id));

        setUserList(users.map(user => ({ ...user, msgCount: 0 })));
        setLoading(false);
      }
    });

    socket.on("message-received", handleIncomingMessage);
    return () => {
      socket.off("message-received", handleIncomingMessage);
    };


  }, [socket, socketId, selectedUser]);

  useEffect(() => {
    const intervalId = setInterval(getAllUserStatuses, 3000);
    return () => clearInterval(intervalId);
  }, [getAllUserStatuses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full px-4 py-6 bg-white space-x-4">
      {/* Sidebar */}
      <div className="w-full sm:w-[22%] h-full bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex flex-col h-full">

          <Header friendsList={friendsList} />

          <div className="flex-1 overflow-auto">
            {userList.map((tmpUser, index) => (
              <div
                key={index}

                onClick={() => {
                  if (!selectedUser || tmpUser.u__id !== selectedUser.u__id) {
                    setSelectedUser(tmpUser);
                    setUserStatus(userStatusRefs.current.get(tmpUser.u__id));
                    setUserList((prev)=>{
                      prev[index].msgCount = 0;
                      return [...prev];
                    })
                  }
                }}

                className="flex items-center space-x-4 p-4 cursor-pointer hover:bg-blue-100 transition duration-200"
              >
                <User tmpUser={tmpUser} user={user} setUserList={setUserList} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {selectedUser && (
        <Chats
          selectedUser={selectedUser}
          userStatus={userStatus}
          messageList={messageList}
          setMessageList={setMessageList}
        />
      )}
    </div>
  );
}
