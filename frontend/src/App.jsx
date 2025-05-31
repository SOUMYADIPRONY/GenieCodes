import React from "react";
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "./context/user.context";
const App=()=>{
  return (
     <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
      </BrowserRouter>
    
  );
}

export default App;