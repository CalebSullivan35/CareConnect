import { useEffect, useState } from "react";
import { ReservePopup } from "./ReservePopup";

export const OpeningsByProviders = ({
  capstoneUserObject,
  userAsPatient,
  setMyScheduledAppointments,
  reRenderAvailableAppointments,
}) => {
  const [myRelationships, setMyRelationships] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null); // Initialize as null
  const [reservePopup, setReservePopup] = useState(false);
  const [
    providerSpecificAvailableAppointments,
    setProviderSpecificAvailableAppointments,
  ] = useState([]);
  const [filteredAppointmentsByAvailable, setfilteredAppointmentsByAvailable] =
    useState([]);

  const [appointmentToSend, setAppointmentToSend] = useState({
    providerAllAppointmentsId: 0,
    patientId: 0,
    providerId: 0,
    ProviderSpecialty: "",
    PrimaryComplaint: "",
  });

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
        });
    }
  }, [selectedProvider, reRenderAvailableAppointments]);
  //  use effect to filter the list of appointments based on if they are available or not.
  useEffect(() => {
    const filtered =
      providerSpecificAvailableAppointments?.filter(
        (appointment) => appointment.isAvailable === true
      ) ?? [];
    setfilteredAppointmentsByAvailable(filtered);
  }, [providerSpecificAvailableAppointments]);

  // function to handle saving the state of the selected providers
  const handleChange = (event) => {
    const selectedProviderId = event.target.value;
    const provider = myRelationships.find(
      (relationship) =>
        relationship.provider.id === parseInt(selectedProviderId)
    );
    setSelectedProvider(provider?.provider || null);
  };

  return (
    <>
      <div className="flex flex-row ml-5 justify-center">
        <div className="flex justify-center align-middle space-x-5 mb-5">
          <h2 className=" font-mono text-2xl font-bold">Select Your Provider:</h2>
          <select
            className="text-xl border-2 rounded-md font-mono"
            name="provider"
            value={selectedProvider ? selectedProvider.id : ""}
            onChange={handleChange}
          >
            <option value="">Select a Provider</option>
            {myRelationships.map((relationship) => (
              <option
                key={relationship.provider.id}
                value={relationship.provider.id}
              >
                {relationship?.provider?.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h2 className="ml-5 mb-5 text-center text-xl">
          Available Appointments:
        </h2>
        {filteredAppointmentsByAvailable.map((appointment) => (
          <div key={appointment.id} className="flex border-2 m-3 justify-between">
            <h2 className="ml-5 m-3">
              Date: {appointment.date} Time: {appointment.time}
            </h2>
            <button
              className="mr-10 my-2 font-mono text-lg font-semibold buttonEffect border-2 px-2 rounded-xl text-blue-600"
              onClick={() => {
                setAppointmentToSend({
                  providerAllAppointmentsId: appointment.id,
                  patientId: userAsPatient?.id,
                  providerId: appointment.providerId,
                  ProviderSpecialty: appointment?.provider?.specialty,
                });
                if (reservePopup) {
                  setReservePopup(false);
                } else {
                  setReservePopup(true);
                }
              }}
            >
              Reserve
            </button>
          </div>
        ))}
      </div>
      {reservePopup && (
        <ReservePopup
          setReservePopup={setReservePopup}
          appointmentToSend={appointmentToSend}
          setAppointmentToSend={setAppointmentToSend}
          setMyScheduledAppointments={setMyScheduledAppointments}
          userAsPatient={userAsPatient}
          setProviderSpecificAvailableAppointments={
            setProviderSpecificAvailableAppointments
          }
          selectedProvider={selectedProvider}
        />
      )}
    </>
  );
};
