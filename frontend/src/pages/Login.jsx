import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";
import { useDispatch } from "react-redux";
import { useSelector} from "react-redux";
const Login = () => {
  const history = useNavigate();
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);

  if(isLoggedIn){
    history("/");
  } 
  const [Data, setData] = useState({ username: "", password: "" });
  
  const dispatch = useDispatch();
  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    try {
        if (!Data.username || !Data.password) {
            alert("All fields are required");
            return;
        }

        const response = await axios.post(
            "http://localhost:5000/api/v1/log-in",
            Data
        );

        setData({ username: "", password: "" });
       // ✅ This will now exist
       
        // Store token in local storage for future authenticated requests
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("id", response.data.id);
        dispatch(authActions.login());
        history("/");
        // Redirect on successful login
       

    } catch (error) {
        alert(error.response?.data?.message || "Something went wrong");
    }
};


  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <div className="text-2xl font-semibold text-white">Login</div>

        <input
          type="text"
          placeholder="Username"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded text-white"
          name="username"
          value={Data.username}
          onChange={change}
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded text-white"
          name="password"
          value={Data.password}
          onChange={change}
        />

        <div className="w-full flex items-center justify-between">
          <button 
            onClick={submit} 
            className="bg-blue-400 font-semibold text-black px-3 py-2 rounded"
          >
            Login
          </button>

          <Link to="/signup" className="text-gray-400 hover:text-gray-200">
            Not having an account? Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
