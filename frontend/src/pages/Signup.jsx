import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const Signup = () => {
  const history = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      history("/");
    }
  }, [isLoggedIn, history]);  // ✅ Add dependencies

  const [Data, setData] = useState({ username: "", email: "", password: "" });

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...Data, [name]: value });
  };

  const submit = async () => {
    if (Data.username === "" || Data.email === "" || Data.password === "") {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/v1/sign-in", Data);

      console.log("Full Response:", response);
      console.log("Response Data:", response.data);

      if (response.data.message) {
        alert(response.data.message);
      }

      history("/login");  // ✅ Redirect to login
    } catch (error) {
      console.error("Error during sign-up:", error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || "Sign-up failed. Please try again.");
    }
  };

  return (
    <div className="h-[98vh] flex items-center justify-center">
      <div className="p-4 w-2/6 rounded bg-gray-800">
        <div className="text-2xl font-semibold">Signup</div>

        <input
          type="text"
          placeholder="Username"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="username"
          value={Data.username}
          onChange={change}
        />

        <input
          type="email"
          placeholder="Email"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="email"
          value={Data.email}
          required
          onChange={change}
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-gray-700 px-3 py-2 my-3 w-full rounded"
          name="password"
          value={Data.password}
          onChange={change}
        />

        <div className="w-full flex items-center justify-between">
          <button className="bg-blue-400 font-semibold text-black px-3 py-2 rounded" onClick={submit}>
            Signup
          </button>
          <Link to="/login" className="text-gray-400 hover:text-gray-200">
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
