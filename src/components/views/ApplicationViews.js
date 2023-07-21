import { PatientViews } from "./PatientViews";
import { ProviderViews } from "./ProviderViews";

export const ApplicationViews = () => {
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  if (capstoneUserObject.isProvider) {
    return <ProviderViews />
  } else {
    return <PatientViews />
  }
}


