import { useEffect, useState } from "react";
import FadeIn from "react-fade-in";
import { UNSAFE_DataRouterStateContext } from "react-router-dom";

export const PatientHome = () => {
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const [userAsPatient, setUserAsPatient] = useState({});
  const [myScheduledAppointments, setMyScheduledAppointments] = useState([]);
  const [myProviders, setMyProviders] = useState([]);

  //list our upcoming 3 appointments.
  //list our current patient info in a drawer.... That way we see some info

  //set as current patient
  useEffect(() => {
    fetch(`http://localhost:8088/patients?userId=${capstoneUserObject.id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserAsPatient(data[0]);
      });
  }, []);

  // Get list of scheduled appointments based off the patient id
  useEffect(() => {
    fetch(
      `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
    )
      .then((response) => response.json())
      .then((data) => {
        setMyScheduledAppointments(data);
      });
  }, [userAsPatient]);
  //Get List of current assigned Providers
  useEffect(() => {
    fetch(
      `http://localhost:8088/providerPatientRelationships?patientId=${userAsPatient.id}&_expand=provider`
    )
      .then((response) => response.json())
      .then((data) => {
        setMyProviders(data);
      });
  }, [userAsPatient]);

  return (
    <div className="bg-slate-200 w-screen h-screen">
        <h1 className=" font-extrabold font-mono text-6xl mt-5 ml-5">CareXpress</h1>
      <FadeIn className="w-2/6 m-5 bg-white mt-20 rounded-3xl p-5">
        <h1 className="text-center font-mono text-4xl mb-4 font-bold">
          Upcoming Appointments
        </h1>
        {myScheduledAppointments.length > 0 ? (
          myScheduledAppointments.map((appointment) => {
            return (
              <div
                className="collapse bg-base-200 p-2 mt-4"
                key={appointment.id}
              >
                <input type="checkbox" />
                <div className="collapse-title text-xl font-medium text-center">
                  Date: {appointment?.providerAllAppointments?.date} Time:{" "}
                  {appointment?.providerAllAppointments?.time}
                </div>
                <div className="collapse-content">
                  <p className="text-3xl font-mono">Provider: {appointment?.provider?.fullName}</p>
                  <p className="text-3xl font-mono">Location: {appointment?.location || "N/A"}</p>
                  <p className="text-3x; font-mono">Complaint: {appointment?.PrimaryComplaint || "N/A"}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-3xl text-center">No scheduled appointments.</p>
        )}
      </FadeIn>
    </div>
  );
};
