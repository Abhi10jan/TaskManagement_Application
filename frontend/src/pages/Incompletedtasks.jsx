import React , {useEffect, useState}from 'react'
import Cards from '../components/Home/Card'
import axios from "axios";

const Incompletedtasks = () => {
 const [Data , setData] = useState();
     useEffect(() => {
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
                           id: id,
                           Authorization: `Bearer ${token}`,
                       }
                   };
       
                   const response = await axios.get(
                       "http://localhost:5000/api/v2/get-incomplete-tasks",
                       headers
                   );
       
                   setData(response.data.data);
       
               } catch (error) {
                   console.error("Error fetching tasks:", error.response?.data || error.message);
               }
           };
       
           fetchTasks();
           
       });
       
     return (
       <div>
         <Cards home = {"false"} data = {Data}/>
       </div>
     )
}

export default Incompletedtasks
