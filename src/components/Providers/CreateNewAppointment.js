import { useEffect, useState } from "react";

export const CreateNewAppointment = ({
 currentProvider,
 setAllProviderAppointments,
 setShowCreateAppointment,
}) => {
 //get The current date
 let currentDate = new Date();
 const currentDay = currentDate.getDate(); // 25
 const currentMonth = currentDate.getMonth() + 1; // 7 (July, adding 1 to get the actual month number)
 const currentYear = currentDate.getFullYear(); // 2023
 const currentwholeDate = `${currentYear}-0${currentMonth}-${currentDay}`;

 const [appointmentInformation, setAppointmentInformation] = useState({
  providerId: currentProvider.id,
  date: `${currentwholeDate}`,
  time: "08:00 AM",
 });
 const [existingAppointments, setExistingAppointments] = useState([]);
 // will need logic to check if there is already an appointment set for this date and time.

 useEffect(() => {
  // Fetch existing appointments when the component mounts
  fetch("http://localhost:8088/providerAllAppointments")
   .then((response) => response.json())
   .then((data) => {
    setExistingAppointments(data);
   });
 }, []);

 const handleChange = (event) => {
  const { name, value } = event.target;
  setAppointmentInformation((prevState) => ({
   ...prevState,
   [name]: value,
  }));
 };

 const handleSubmitButton = () => {
  const isExistingAppointment = existingAppointments.some(
   (appointment) =>
    appointment.providerId === appointmentInformation.providerId &&
    appointment.date === appointmentInformation.date &&
    appointment.time === appointmentInformation.time
  );

  if (isExistingAppointment) {
   window.alert(`Already an appointment with this time`);
  } else {
   const dataToSendToApi = {
    providerId: currentProvider.id,
    date: appointmentInformation.date,
    time: appointmentInformation.time,
    isAvailable: true,
   };

   fetch("http://localhost:8088/providerAllAppointments", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSendToApi),
   })
    .then((response) => response.json())
    .then(() => {
     // After successful POST request, fetch the updated list of appointments
     fetch(
      `http://localhost:8088/providerAllAppointments?providerId=${currentProvider.id}`
     )
      .then((response) => response.json())
      .then((data) => {
       console.log(currentwholeDate);
       console.log(data);
       // Update the state with the updated array of appointments
       setAllProviderAppointments(data);
      });
    })
    .catch((error) => {
     console.error("Error sending data to API:", error);
    });
  }
 };

 return (
  <div className="fixed inset-0 flex flex-col items-center mt-64 text-center">
   <div className="flex justify-center align-middle items-center flex-col mt-10 bg-base-100 p-10 rounded-2xl">
    <div className=" border-b-2 p-5">
     <h1 className="text-3xl font-mono">Create New Appointment </h1>
    </div>
    <div className="flex flex-col m-5">
     <input
      className="mb-5 text-3xl"
      type="date"
      name="date"
      value={appointmentInformation.date}
      onChange={handleChange}
     ></input>
     <select
      className="mb-5 text-3xl"
      type="time"
      name="time"
      value={appointmentInformation.time}
      onChange={handleChange}
     >
      <option>08:00 AM</option>
      <option>09:00 AM</option>
      <option>10:00 AM</option>
      <option>11:00 AM</option>
      <option>12:00 PM</option>
      <option>01:00 PM</option>
      <option>02:00 PM</option>
      <option>03:00 PM</option>
      <option>04:00 PM</option>
      <option>05:00 PM</option>
     </select>
    </div>
    <div className="flex flex-row justify-evenly w-96">
     <button
      className="font-mono text-3xl buttonEffect px-2 py-1 border-2 rounded-xl text-blue-600"
      onClick={handleSubmitButton}
     >
      Submit
     </button>
     <button
      className="font-mono text-red buttonEffect text-3xl px-2 py-1 border-2 rounded-xl text-red-600"
           onClick={() => { setShowCreateAppointment(false) }}
     >
      {" "}
      Close
     </button>
    </div>
   </div>
  </div>
 );
};
