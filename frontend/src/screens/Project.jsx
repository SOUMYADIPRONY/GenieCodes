import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";

const Project = () => {

   const location = useLocation();
   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [users, setUsers] = useState([]);
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [project, setProject] = useState(location.state.project)
   // console.log(location.state);
   

   const handleUserSelect = (userId) => {
      setSelectedUsers(prev => {
         if (prev.includes(userId)) {
            return prev.filter(id => id !== userId);
         }
         return [...prev, userId];
      });
   };

   function addCollaborators(){
      axiosInstance.put("/projects/add-user",{
         projectId: location.state.project._id,
         users: Array.from(selectedUsers)
      }).then(res=>{
         console.log(res.data)
         setIsModalOpen(false)

      }).catch(err=>{
         console.log(err)
      })
   }

   useEffect(() => {
      axiosInstance.get(`projects/get-project/${location.state.project._id}`).then(res=>{
         console.log(res.data.project)
         setProject(res.data.project)
      })
      const fetchUsers = async () => {
         try {
            const response = await axiosInstance.get('/users/all-users');
            setUsers(response.data.users);
         } catch (error) {
            console.error('Error fetching users:', error);
         }
      };
      fetchUsers();
   }, []);
return (
    <main
      className='h-screen w-screen flex'>

            <section className="left flex flex-col h-full min-w-96 bg-slate-300 relative">   

                      <header className="flex justify-between items-center w-full p-2 px-4 bg-slate-200">
                                                <button 
                        className="flex gap-2 items-center hover:bg-gray-100 px-3 py-2 rounded-lg"
                        onClick={() => setIsModalOpen(true)}
                        >
                        <i className="ri-user-add-fill"></i>
                        <p>Add Collaborator</p>
                        </button>
                        
                         <button 
                         onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}
                         className='p-2'>
                         
                            <i className="ri-user-community-fill"></i>
                      </button>
                      </header>

                      <div className="conversation-area flex-grow flex flex-col">

                            <div className="message-box p-1 flex-grow flex flex-col gap-1">
                                 <div className="message max-w-56 flex flex-col p-2 m-2 bg-slate-50 w-fit rounded-md">
                                      <small className="opacity-65 text-xs">example@gmail.com</small>
                                      <p className="text-sm break-words">Lorem ipsum d</p>
                                 </div>
                                 <div className="ml-auto max-w-56  message flex flex-col p-2 bg-slate-50 w-fit rounded-md">
                                      <small className="opacity-65 text-xs">example@gmail.com</small>
                                      <p className="text-sm break-words">Lorem ipsum doldddddddddddddddddddddddddddddddddddddddddddddddddddr</p>
                                 </div>
                            </div>
                                 <div className="inputField w-full flex">
                                      <input className='p-2 px-4 border-none outline-none flex-grow ' type="text"  placeholder='Enter Message'/>
                                      <button className='px-5 bg-orange-300'>
                                            <i class="ri-send-plane-fill"></i>
                                      </button>
                                 </div>
                      </div>

                      <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen?'translate-x-0':'-translate-x-full'} top-0`}>
                                <header className='flex justify-between p-2 px-3 bg-slate-200'>

                                             <h1 className="font-semibold text-lg py-2" >Collaborators</h1>
                                            <button
                                                onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}
                                                className='p-2'
                                            >
                                                    <i class="ri-arrow-left-box-fill"></i>
                                            </button>
                                </header>

                                <div className="users flex flex-col gap-2">
                                   {project.users && project.users.map(user=>{
                                       return(
                                           <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
                                                <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                                                   <i className="ri-user-star-fill absolute"></i>
                                                </div>
                                                <h1 className='font-semibold text-lg'>{user.email}</h1>
                                          </div>
                                       )
                                   })}
                                </div>
                      </div>
            </section>

         {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
               <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                  <header className="flex justify-between items-center p-4 border-b">
                     <h2 className="text-xl font-semibold">Add Collaborators</h2>
                     <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                     >
                        <i className="ri-close-line text-2xl"></i>
                     </button>
                  </header>

                  <div className="p-4 max-h-96 overflow-y-auto">
                     {users.map(user => (
                        <div 
                           key={user._id}
                           onClick={() => handleUserSelect(user._id)}
                           className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                              ${selectedUsers.includes(user._id) 
                                 ? 'bg-blue-50 border-2 border-blue-500' 
                                 : 'hover:bg-gray-50'
                              }`}
                        >
                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <i className="ri-user-line text-gray-600"></i>
                           </div>
                           <div className="users-list max-h-96 flex-1">
                              <h3 className="font-medium">{user.email}</h3>
                           </div>
                           
                           {selectedUsers.includes(user._id) && (
                              <i className="ri-check-line text-blue-500 text-xl"></i>
                           )}
                        </div>
                     ))}
                  </div>

                  <footer className="flex justify-end gap-2 p-4 border-t">
                     <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                     >
                        Cancel
                     </button>
                     <button 
                        onClick={addCollaborators }
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                     >
                        Add Selected
                     </button>
                  </footer>
               </div>
            </div>
         )}  
            
    </main>
);
}

export default Project;