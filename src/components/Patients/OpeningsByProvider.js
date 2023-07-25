import { useEffect, useState } from "react";
import { ReservePopup } from "./ReservePopup";

export const OpeningsByProviders = ({ capstoneUserObject, userAsPatient }) => {
 const [myRelationships, setMyRelationships] = useState([]);
 const [selectedProvider, setSelectedProvider] = useState(null); // Initialize as null
 const [reservePopup, setReservePopup] = useState(false);
 const [
  providerSpecificAvailableAppointments,
  setProviderSpecificAvailableAppointments,
 ] = useState([]);

 // get the list of users current providers
 useEffect(() => {
  fetch(
   `http://localhost:8088/providerPatientRelationships?patientId=${userAsPatient.id}&_expand=provider`
  )
   .then((response) => response.json())
   .then((data) => {
    setMyRelationships(data);
   });
 }, [userAsPatient.id]);

 // get the current list of the selected provider's available appointments
 useEffect(() => {
  if (selectedProvider) {
   // Check if selectedProvider is not null
   fetch(
    `http://localhost:8088/providerAllAppointments?providerId=${selectedProvider.id}&_expand=provider`
   )
    .then((response) => response.json())
    .then((data) => {
     setProviderSpecificAvailableAppointments(data);
     console.log(data);
    });
  }
 }, [selectedProvider]);

 // function to handle saving the state of the selected providers
 const handleChange = (event) => {
  const selectedProviderId = event.target.value;
  const provider = myRelationships.find(
   (relationship) => relationship.provider.id === parseInt(selectedProviderId)
  );
  setSelectedProvider(provider?.provider || null);
 };
 //function to handle the reserve button. Will Post the Reservation

 //   const handleReserve = (relationship) => {
 //     const dataToSendToApi = {
 //       providerAllAppointmentsId: relationship.id,
 //       patientId: relationship.patientId,
 //       providerId: relationship.providerId
 //     }
 //     fetch("http://localhost:8088/providerAllAppointments", {
 //     method: "POST",
 //     headers: {
 //      "Content-Type": "application/json",
 //     },
 //     body: JSON.stringify(),
 //    })
 //     .then((response) => response.json())
 //  }

 return (
  <>
   <div className="flex flex-row ml-5">
    <h2 className="ml-5 text-3xl">Select Your Provider:</h2>
    <select
     className="ml-5 text-2xl mb-5"
     name="provider"
     value={selectedProvider ? selectedProvider.id : ""} // Set the value to the provider's id
     onChange={handleChange}
    >
     <option value="">Select a Provider</option>
     {myRelationships.map((relationship) => (
      <option key={relationship.provider.id} value={relationship.provider.id}>
       {relationship?.provider?.fullName}
      </option>
     ))}
    </select>
   </div>
   <div>
    <h2 className="ml-5 mb-5 text-3xl">Available Appointments:</h2>
    {providerSpecificAvailableAppointments.map((appointment) => (
     <div className="flex border-2 m-3">
      <h2 className="ml-5 m-3">
       {appointment.date} at {appointment.time}
        </h2>
      <button
       onClick={() => {
        setReservePopup(true);
       }}
      >
       Reserve
      </button>
     </div>
    ))}
   </div>
   {reservePopup && <ReservePopup />}
  </>
 );
};
