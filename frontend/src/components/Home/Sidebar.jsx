import React, { useState, useEffect } from "react";
import { CgNotes } from "react-icons/cg";
import { MdLabelImportant } from "react-icons/md";
import { FaCheckDouble } from "react-icons/fa6";
import { TbNotebookOff } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import axios from "axios";

const Sidebar = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [user, setUser] = useState(null);

  const data = [
    {
      title: "All tasks",
      icon: <CgNotes />,
      link: "/",
    },
    {
      title: "Important tasks",
      icon: <MdLabelImportant />,
      link: "./importantTasks",
    },
    {
      title: "Completed tasks",
      icon: <FaCheckDouble />,
      link: "./completedTasks",
    },
    {
      title: "Incompleted tasks",
      icon: <TbNotebookOff />,
      link: "./incompletedTasks",
    },
  ];

  const logout = () => {
    dispatch(authActions.logout());
    localStorage.clear("id");
    localStorage.clear("token");
    history("/signup");
  };

  useEffect(() => {
    const fetchUser = async () => {
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

        const response = await axios.get(
          "https://task-backend-bb9k.onrender.com/api/v2/get-user",
          headers
        );

        setUser(response.data.user); // Make sure backend returns `user`

      } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      {user && (
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <h4 className="mb-1 text-gray-400">{user.email}</h4>
          <hr className="mb-4" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {data.map((items, i) => (
          <Link
            to={items.link}
            key={i}
            className="flex items-center gap-x-2 hover:bg-gray-600 p-2 rounded transition-all duration-300"
          >
            {items.icon} {items.title}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <button className="bg-gray-600 w-full p-2 rounded" onClick={logout}>
          Log Out
        </button>
      </div>
    </>
  );
};

export default Sidebar;
