import React, {useContext, useState, useEffect, use} from "react";
import { UserContext } from "../context/user.context";
import axiosInstance from "../config/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Home = () => {    

   const {user}=useContext(UserContext);  
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [projectName, setProjectName] = useState(null);
   const [project, setProject] = useState([]);
   const navigate = useNavigate();
   function createProject(e){

      e.preventDefault()
      console.log({projectName})

      axiosInstance.post("/projects/create", {name: projectName,}).then((res)=>{
         console.log(error)
         console.log(res)
         setIsModalOpen(false)
      }).catch((err)=>{
         console.log(err.response.data)
      })     

         
   }

   useEffect(() => {
    axiosInstance.get("/projects/all").then((res) => {
      console.log(res.data);
      setProject(res.data.projects);
    }).catch((err) => {
      console.log(err.response.data);
    });
   }, []);

   return(
         <main className='p-4'>

            <div className="projects flex flex-wrap gap-3">
               <button onClick={()=> setIsModalOpen(true)} className="project p-4 border-2 rounded-md border-gray-300 hover:border-gray-500 hover:bg-gray-100 "> 
                New Project
               <i className="ri-folder-add-line m-2"></i>

               </button>

                  {
                     project.map((project)=>(
                        <div key={project._id}  
                        onClick={()=> navigate(`/project`, {state: {project}})}
                    
                        className="project cursor-pointer flex flex-col gap-2 p-4 border-2 rounded-md border-gray-300 hover:border-gray-500 hover:bg-gray-400 ">
                        <h2 className="text-lg font-semibold">{project.name}</h2>
                        
                        <div className="flex gap-2 items-center">
                           <i className="ri-user-heart-line"></i>
                           <p><small>Collaborators</small></p>
                           {project.users.length}</div>
                        </div>
                     ))
                  }
            </div>

            {isModalOpen && (
               <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                     <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                     <form onSubmit={ createProject}>
                        <div className="mb-4">
                           <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                              Project Name
                           </label>
                           <input
                              onChange={(e)=> setProjectName(e.target.value)}
                              value={projectName}
                              type="text"
                              id="projectName"
                              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter project name"
                              required
                           />
                        </div>
                        <div className="flex justify-end">
                           <button
                              type="button"
                              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                              onClick={() => setIsModalOpen(false)}
                           >
                              Cancel
                           </button>
                           <button
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                           >
                              Create
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
            

      </main>
   )
}

export default Home;