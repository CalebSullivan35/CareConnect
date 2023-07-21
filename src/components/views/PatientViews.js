import { Outlet, Route, Routes } from "react-router-dom"
import { PatientProfile } from "../Patients/PatientProfile"
import { ListAllProviders } from "../Patients/ListAllProviders"
import { ListMyProviders } from "../Patients/ListMyProviders"

export const PatientViews = () => {

  return (
  <Routes>
   <Route
    path="/"
    element={
     <>
      <Outlet />
     </>
    }
   >
        <Route path="PatientProfile" element={< PatientProfile />} />
        <Route path="ListAllProviders" element={<ListAllProviders />}/>
        <Route path="ListMyProviders" element={<ListMyProviders />}/>
   </Route>
  </Routes>
  )
}