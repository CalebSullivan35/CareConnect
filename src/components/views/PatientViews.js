import { Outlet, Route, Routes } from "react-router-dom"
import { PatientProfile } from "../Patients/PatientProfile"
import { ListAllProviders } from "../Patients/ListAllProviders"
import { ListMyProviders } from "../Patients/ListMyProviders"
import { PatientMyAppointments } from "../Patients/PatientMyAppointments"
import { PatientHome } from "../Patients/PatientHome"

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
        <Route path="ListMyProviders" element={<ListMyProviders />} />
        <Route path="PatientMyAppointments" element={<PatientMyAppointments />} />
        <Route path="PatientHome" element={<PatientHome />} />
   </Route>
  </Routes>
  )
}