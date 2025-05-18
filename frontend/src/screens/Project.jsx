import React, {useState, useEffect,useContext} from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../config/axios";
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket";
import {UserContext} from '../context/user.context' 

const Project = () => {

   const location = useLocation();
   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [users, setUsers] = useState([]);
   const [selectedUsers, setSelectedUsers] = useState([]);
   const [project, setProject] = useState(location.state.project);
   const [message, setMessage]= useState('');
   const {user} = useContext(UserContext);
   const messageBox = React.useRef(null);

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

   const sendInProjectChat = () => {
   
           sendMessage('project-message', {
               message,
               sender: user
           })
           appendOutgoingMessage(message)
           setMessage("")
   
       }



   useEffect(() => {

      initializeSocket(project._id)
      
      receiveMessage('project-message', data=>{
                  console.log('Received message:', data);
                  appendIncomingMessage(data)
      })
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



  function appendIncomingMessage(messageObject){
  const message = document.createElement('div');
  message.className = 'message max-w-56 flex flex-col p-2 m-2 bg-slate-50 w-fit rounded-md';
  message.innerHTML = `
    <small class='opacity-65 text-xs'>${messageObject.sender.email}</small>
    <p class='text-sm'>${messageObject.message}</p>
  `;
  messageBox.current.appendChild(message);
  scrollToBottom();
}



     function appendOutgoingMessage(messageText) {
      if (!messageBox.current) return; // Safety check
      const newMessage = document.createElement('div');

      newMessage.classList.add('ml-auto', 'max-w-56', 'message', 'flex', 'flex-col', 'p-2', 'bg-slate-50', 'w-fit', 'rounded-md');
      newMessage.innerHTML = `
         <small class='opacity-65 text-xs'>${user.email}</small>
         <p class='text-sm'>${messageText}</p>
      `;
      messageBox.current.appendChild(newMessage);
      scrollToBottom();
}

   function scrollToBottom(){
       messageBox.current.scrollTop = messageBox.current.scrollHeight
     }
return (
    <main
      className='h-screen w-screen flex overflow-hidden'>

            <section className="left flex flex-col h-screen min-w-96 bg-slate-300 relative overflow-hidden">   

                      <header className="flex justify-between items-center w-full p-2 px-4 bg-slate-200 absolute top-0 z-10">
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

                      <div className="conversation-area py-14 pb-10 flex-grow flex flex-col relative">
                              <div className="absolute inset-0 pt-14 pb-14 flex flex-col">
                            <div ref={messageBox} className="message-box flex-grow flex flex-col gap-1 overflow-y-auto overflow-x-hidden p-2">
                                 
                            </div>
                            </div>
                                 <div className="inputField w-full flex absolute bottom-0 left-0 bg-white">
                                      <input
                                      value={message}
                                      onChange={(e)=> setMessage(e.target.value)}
                                     
                                      className='p-2 px-4 border-none outline-none flex-grow ' type="text"  placeholder='Enter Message'/>
                                      <button  onClick={sendInProjectChat}
                                      className='px-5 bg-orange-300'>
                                            <i className="ri-send-plane-fill"></i>
                                      </button>
                                 </div>
                      </div>

                      <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${isSidePanelOpen?'translate-x-0':'-translate-x-full'} top-0 z-20`}>
                                <header className='flex justify-between p-2 px-3 bg-slate-200'>

                                             <h1 className="font-semibold text-lg py-2" >Collaborators</h1>
                                            <button
                                                onClick={()=> setIsSidePanelOpen(!isSidePanelOpen)}
                                                className='p-2'
                                            >
                                                    <i className="ri-arrow-left-box-fill"></i>
                                            </button>
                                </header>

                                <div className="users flex flex-col gap-2">
                                   {project.users && project.users.map(user=>{
                                       return(
                                           <div key={user._id} className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
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

                  <div className="p-4 max-h-96 overflow-y-auto overflow-x-hidden">
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
                           <div className="flex-1">
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
                        onClick={addCollaborators}
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