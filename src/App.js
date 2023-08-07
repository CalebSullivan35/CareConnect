import { Route, Routes } from "react-router-dom";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Authorized } from "./components/views/Authorized";
import { ApplicationViews } from "./components/views/ApplicationViews";
import { NavBar } from "./components/nav/NavBar";
export const App = () => {
 return (
  <Routes>
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />
   <Route
    path="*"
    element={
     <Authorized>
      <>
       <div className="app-container flex flex-col bg-base-200 w-screen h-screen">
        <NavBar />
        <ApplicationViews />
       </div>
      </>
     </Authorized>
    }
   />
  </Routes>
 );
};
