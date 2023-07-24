import { Outlet, Route, Routes } from "react-router-dom";
import { CreateNewAppointment } from "../Providers/CreateNewAppointment";
import { ListMyPatients } from "../Providers/ListMyPatients";
import { ProviderMyAppointments } from "../Providers/ProviderMyAppointments";
import { ProviderProfile } from "../Providers/ProviderProfile";

export const ProviderViews = () => {
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
        <Route path="ProviderProfile" element={<ProviderProfile />} />
        <Route path="ListMyPatients" element={<ListMyPatients />} />
        <Route path="ProviderMyAppointments" element={<ProviderMyAppointments />} />
        <Route path="ProviderMyAppointments/CreateNewAppointment" element={<CreateNewAppointment />} />
      </Route>
    </Routes>
  );
};
