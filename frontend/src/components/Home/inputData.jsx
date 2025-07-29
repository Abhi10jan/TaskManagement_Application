import React, { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";

const InputData = ({ InputDiv, setInputDiv, UpdatedData, setUpdatedData, fetchTasks }) => {
  const [Data, setData] = useState({ title: "", des: "" });

  useEffect(() => {
    setData({ title: UpdatedData.title, des: UpdatedData.des });
  }, [UpdatedData]);

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submitData = async () => {
    if (!Data.title.trim() || !Data.des.trim()) {
      alert("All fields are required");
      return;
    }

    const headers = {
      id: localStorage.getItem("id"),
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      await axios.post("https://task-backend-bb9k.onrender.com/api/v2/create-task", Data, { headers });
      setData({ title: "", des: "" });
      setInputDiv("hidden");
      fetchTasks(); // ✅ refresh tasks
    } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      alert("Failed to create task. Please try again.");
    }
  };

  const updateData = async () => {
    if (!Data.title.trim() || !Data.des.trim()) {
      alert("All fields are required");
      return;
    }

    const headers = {
      id: localStorage.getItem("id"),
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      await axios.put(`https://task-backend-bb9k.onrender.com/api/v2/update-task/${UpdatedData.id}`, Data, { headers });
      setUpdatedData({ id: "", title: "", des: "" });
      setData({ title: "", des: "" });
      setInputDiv("hidden");
      fetchTasks(); // ✅ refresh tasks
    } catch (error) {
      console.error("Error updating task:", error.response?.data || error.message);
      alert("Failed to update task. Please try again.");
    }
  };

  return (
    <>
      <div className={`${InputDiv} top-0 left-0 bg-gray-800 opacity-80 h-screen w-full`}></div>
      <div className={`${InputDiv} top-0 left-0 flex items-center justify-center h-screen w-full`}>
        <div className="w-2/6 bg-gray-900 p-4 rounded">
          <div className="flex justify-end">
            <button
              className="text-2xl"
              onClick={() => {
                setInputDiv("hidden");
                setData({ title: "", des: "" });
                setUpdatedData({ id: "", title: "", des: "" });
              }}
            >
              <RxCross2 />
            </button>
          </div>
          <input
            type="text"
            placeholder="Title"
            name="title"
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.title}
            onChange={change}
          />
          <textarea
            name="des"
            cols="30"
            rows="10"
            placeholder="Description..."
            className="px-3 py-2 rounded w-full bg-gray-700 my-3"
            value={Data.des}
            onChange={change}
          ></textarea>
          {UpdatedData?.id ? (
            <button className="px-3 py-2 bg-blue-400 rounded text-black text-xl w-full" onClick={updateData}>
              Update
            </button>
          ) : (
            <button className="px-3 py-2 bg-blue-400 rounded text-black text-xl w-full" onClick={submitData}>
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default InputData;
