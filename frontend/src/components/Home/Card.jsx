import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaEdit, FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import axios from "axios";

const Cards = ({ home, setInputDiv, data = [], setUpdatedData, fetchTasks }) => {
  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleCompleteTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v2/update-complete-task/${id}`, {}, { headers });
      fetchTasks(); // ✅ refresh tasks
    } catch (error) {
      console.log(error);
    }
  };

  const handleImpTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/v2/update-imp-task/${id}`, {}, { headers });
      fetchTasks(); // ✅ refresh tasks
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/v2/delete-task/${id}`, { headers });
      fetchTasks(); // ✅ refresh tasks
    } catch (error) {
      console.log(error);
    }
  };

  const updateTask = (id, title, des) => {
    setUpdatedData({ id, title, des });
    setInputDiv("fixed");
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {data.map((items, i) => (
        <div key={i} className="flex flex-col justify-between bg-gray-800 rounded-sm p-4">
          <div>
            <h3 className="text-xl font-semibold">{items.title}</h3>
            <p className="text-gray-300 my-2">{items.des}</p>
          </div>
          <div className="mt-4 w-full flex items-center">
            <button
              className={` ${items.complete === false ? "bg-red-400" : "bg-green-700"} p-2 rounded w-3/6`}
              onClick={() => handleCompleteTask(items._id)}
            >
              {items.complete ? "Completed" : "Pending"}
            </button>
            <div className="text-white p-2 w-3/6 text-2xl font-semibold flex justify-around">
              <button onClick={() => handleImpTask(items._id)}>
                {!items.important ? <CiHeart /> : <FaHeart className="text-red-500" />}
              </button>
              <button onClick={() => updateTask(items._id, items.title, items.des)}>
                <FaEdit />
              </button>
              <button onClick={() => deleteTask(items._id)}>
                <MdDelete />
              </button>
            </div>
          </div>
        </div>
      ))}

      {home === "true" && (
        <button
          onClick={() => setInputDiv("fixed")}
          className="flex flex-col justify-center items-center bg-gray-800 rounded-sm p-4 text-gray-300 hover:scale-105 hover:cursor-pointer transition-all duration-300"
        >
          <IoAddCircleSharp className="text-5xl" />
          <h2 className="text-2xl mt-4">Add Task</h2>
        </button>
      )}
    </div>
  );
};

export default Cards;
