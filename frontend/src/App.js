import React, { useEffect, useState } from "react";
import Home from "./pages/Home";
import AllTasks from "./pages/Alltasks";
import ImportantTasks from "./pages/Importanttasks";
import CompletedTasks from "./pages/Completedtasks";
import IncompletedTasks from "./pages/Incompletedtasks";
import { Routes, Route, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "./store/auth";

const App = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true); // <- Loading flag

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (id && token) {
      dispatch(authActions.login());
    }
    setLoading(false); // <- Only after checking localStorage
  }, [dispatch]);

  useEffect(() => {
  const currentPath = window.location.pathname;
  if (
    !loading &&
    !isLoggedIn &&
    currentPath !== "/login" &&
    currentPath !== "/signup"
  ) {
    navigate("/signup");
  }
}, [isLoggedIn, navigate, loading]);


  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white h-screen p-2 relative">
      <Routes>
        <Route exact path="/" element={<Home />}>
          <Route index element={<AllTasks />} />
          <Route path="/importantTasks" element={<ImportantTasks />} />
          <Route path="/completedTasks" element={<CompletedTasks />} />
          <Route path="/incompletedTasks" element={<IncompletedTasks />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
