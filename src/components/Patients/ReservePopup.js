import { useEffect, useState } from "react";

export const ReservePopup = ({
  setReservePopup,
  appointmentToSend,
  setAppointmentToSend,
  userAsPatient,
  setMyScheduledAppointments
}) => {
  const [patientPrimaryComplaint, setPatientPrimaryComplaint] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);

  //function that will post everything.
  const handleScheduleButton = async () => {
    setAppointmentToSend((prevState) => ({
      ...prevState,
      PrimaryComplaint: patientPrimaryComplaint,
    }));
    setIsScheduled(true);
  };

  // Use useEffect to trigger fetch when appointmentToSend state changes and isScheduled is true
  useEffect(() => {
    if (isScheduled && appointmentToSend.PrimaryComplaint !== "") {
      fetch("http://localhost:8088/scheduledAppointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("Error while making the POST request:", error);
        })
        .finally(() => {
          setIsScheduled(false); // Reset the flag after the API call is completed
        });
    }
  }, [appointmentToSend, isScheduled]);

  //fetch updated list of appointments
  useEffect(() =>{
    fetch(
      `http://localhost:8088/scheduledAppointments?patientId=${userAsPatient.id}&_expand=providerAllAppointments&_expand=provider`
     )
      .then((response) => response.json())
      .then((data) => {
       setMyScheduledAppointments(data);
      })
  },[isScheduled])

  // Rest of your component code...

  useEffect(() => {
    console.log(appointmentToSend);
  }, [appointmentToSend]);

  const handlePrimaryComplaintChange = (event) => {
    setPatientPrimaryComplaint(event.target.value);
  };

  return (
    <div className=" fixed inset-0 flex flex-col items-center justify-center text-center ">
      <div className="bg-white p-10 rounded shadow-lg">
        <h3 className="mb-5 text-lg">Please Enter Your Primary Complaint</h3>
        <input
          type="text"
          className="mb-5 text-center"
          name="complaint"
          placeholder="Primary Complaint"
          value={patientPrimaryComplaint}
          onChange={handlePrimaryComplaintChange}
        />
        <div className="flex justify-evenly">
          <button
            className="border-2 p-1 px-2 rounded-lg shadow-sm"
            onClick={async () => {
              await handleScheduleButton();
              setReservePopup(false);
            }}
          >
            Schedule
          </button>
          <button
            className="border-2 p-1 px-2 rounded-lg shadow-sm"
            onClick={() => {
              setReservePopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
