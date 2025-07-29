import React, { useState, useEffect } from 'react';
import Cards from '../components/Home/Card';
import InputData from '../components/Home/inputData';
import { IoAddCircleSharp } from "react-icons/io5";
import axios from "axios";

const Alltasks = () => {
  const [inputDiv, setInputDiv] = useState("hidden");
  const [data, setData] = useState([]);
  const [updatedData, setUpdatedData] = useState({ id: "", title: "", des: "" });

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      if (!token || !id) {
        console.error("User not authenticated!");
        return;
      }

      const headers = {
        headers: {
          id,
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("https://task-backend-bb9k.onrender.com/api/v2/get-all-tasks", headers);
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <div>
        <div className="w-full flex justify-end p-4">
          <button onClick={() => setInputDiv("fixed")}>
            <IoAddCircleSharp className="text-4xl text-gray-300 hover:text-gray-100 transition-all duration-300" />
          </button>
        </div>

        <Cards
          home="true"
          setInputDiv={setInputDiv}
          data={data}
          setUpdatedData={setUpdatedData}
          fetchTasks={fetchTasks}
        />

        {data.length === 0 && (
          <p className="text-center text-gray-400 mt-8">No tasks available</p>
        )}
      </div>

      <InputData
        InputDiv={inputDiv}
        setInputDiv={setInputDiv}
        UpdatedData={updatedData}
        setUpdatedData={setUpdatedData}
        fetchTasks={fetchTasks}
      />
    </>
  );
};

export default Alltasks;
