import React, { useState, useContext } from "react";
import { AuthContext } from "../store/authContext";
import { SocketContext } from "../store/socketIdContext";

export default function UpdateProfile() {
  const [fileName, setFileName] = useState("");
  const { user, token } = useContext(AuthContext).authData;
  const [file, setFile] = useState(null);
  const { socket } = useContext(SocketContext);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setMessage(""); // clear previous messages
      setError(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const buffer = e.target.result;

      socket.emit(
        "file-upload",
        {
          fileName: file.name,
          fileType: file.type,
          fileData: buffer,
          _id: user._id,
          token: token,
        },
        (data) => {
          // ✅ backend returns { error, msg }
          setError(data.error);
          setMessage(data.msg);
        }
      );
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Custom button to trigger input */}
      <label
        htmlFor="fileInput"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Choose File
      </label>

      {/* Show selected file name */}
      {fileName && (
        <p className="text-gray-700 text-sm font-medium">📂 {fileName}</p>
      )}

      <button
        className={`px-4 py-2 rounded shadow text-white ${
          file ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={handleUpload}
        disabled={!file}
      >
        Upload
      </button>

      {/* Show messages */}
      {message && (
        <p className={error ? "text-red-500" : "text-green-600"}>{message}</p>
      )}
    </div>
  );
}
