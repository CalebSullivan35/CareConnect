import { useEffect, useState } from "react";
import { OpeningsByProviders } from "./OpeningsByProvider";

export const PatientMyAppointments = () => {
  //get Current User
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const [userAsPatient, setUserAsPatient] = useState({});
  const [myScheduledAppointments, setMyScheduledAppointments] = useState([]);
  const [allProviderAppointments, setAllProviderAppointments] = useState([]);
  const [reRenderAvailableAppointments, setReRenderAvailableAppointments] =
    useState(false);

  //get current user as patient
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

  //get list of all provider appointments
  useEffect(() => {
    fetch(`http://localhost:8088/providerAllAppointments`)
      .then((response) => response.json())
      .then((data) => {
        setAllProviderAppointments(data);
      });
  }, []);

  //Handle Cancel AppointmentButton

  //make it so that it does a put request to change the selected appointmed back to true
  const handleCancelAppointmentButton = (appointment) => {
    // complete the put request then do the delete.
    //find the matching appointment
    const matchingAppointment = allProviderAppointments.find((match) => {
      return match.id === appointment.providerAllAppointmentsId;
    });
    //get info to put
    const appointmentInfoToPut = {
      providerId: matchingAppointment?.providerId,
      date: matchingAppointment?.date,
      time: matchingAppointment?.time,
      isAvailable: true,
    };

    fetch(
      `http://localhost:8088/providerAllAppointments/${appointment.providerAllAppointmentsId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentInfoToPut), // Use appointmentToPut data for the PUT request
      }
    ).then((response) => response.json());

    fetch(`http://localhost:8088/scheduledAppointments/${appointment.id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        // Refetch the provider relationships after successful deletion
        fetch(
          `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
        )
          .then((response) => response.json())
          .then((data) => {
            setMyScheduledAppointments(data);
          });
      })
      .then(() => {
        if (reRenderAvailableAppointments) {
          setReRenderAvailableAppointments(false);
        } else {
          setReRenderAvailableAppointments(true);
        }
      });
  };

  return (
    <div className="flex flex-col bg-slate-200  w-screen min-h-screen ">
      <h1 className="text-center text-5xl mt-5 mb-5">Appointment Manager</h1>
      <div className="flex flex-row justify-evenly">
        <div className=" bg-white border-2 m-5 w-5/12 h-fit rounded-xl">
          <h1 className="text-center text-3xl mt-5 font-mono font-bold pb-3">
            Your Scheduled Appointments
          </h1>
          <div>
            {myScheduledAppointments.map((appointment) => {
              return (
                <div className="border-2 m-5 p-5">
                  <h3 className="text-xl mb-5 text-center">
                    Scheduled: {appointment?.providerAllAppointments?.date}{" "}
                    {appointment?.providerAllAppointments?.time}
                  </h3>
                  <div className="flex justify-between">
                    <p className="text-xl">
                      Provider : {appointment?.provider?.fullName}
                    </p>
                    <p className="text-xl">
                      Specialty: {appointment?.provider?.specialty}
                    </p>
                  </div>
                  <h3 className="text-xl">
                    Education: {appointment?.provider?.education}
                  </h3>
                  <div className="flex flex-row justify-between">
                    <h3 className="text-xl">
                      Reason: {appointment?.PrimaryComplaint}
                    </h3>
                    <button
                      className="text-red-400 mr-5 buttonEffect border px-2 py-1 rounded-md font-mono font-semibold"
                      onClick={() =>
                        handleCancelAppointmentButton(
                          appointment,
                          userAsPatient
                        )
                      }
                    >
                      Cancel Appointment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className=" bg-white border-2 m-5 w-5/12 rounded-xl h-fit">
          <h1 className="text-center text-3xl mb-5 font-mono font-bold mt-5">
            Current Openings!
          </h1>
          <OpeningsByProviders
            setMyScheduledAppointments={setMyScheduledAppointments}
            capstoneUserObject={capstoneUserObject}
            userAsPatient={userAsPatient}
            reRenderAvailableAppointments={reRenderAvailableAppointments}
          />
        </div>
      </div>
    </div>
  );
};
