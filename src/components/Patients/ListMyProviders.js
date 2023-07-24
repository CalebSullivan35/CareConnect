import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ListMyProviders = () => {
  const navigate = useNavigate();
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const [myRelationships, setRelationships] = useState([]);
  const [currentPatient, setCurrentPatient] = useState({});
  const [providers, setProviders] = useState([]);

  // get current patient from user
  useEffect(() => {
    fetch(`http://localhost:8088/patients?userId=${capstoneUserObject.id}`)
      .then((response) => response.json())
      .then((data) => {
        setCurrentPatient(data[0]);
      });
  }, []);
  //fetchest all the providers and expands upon the user.
  useEffect(() => {
    fetch(`http://localhost:8088/providers?_expand=user`)
      .then((response) => response.json())
      .then((data) => setProviders(data));
  }, [currentPatient]);

  //fetches relationships
  useEffect(() => {
    fetch(
      `http://localhost:8088/providerPatientRelationships?patientId=${currentPatient.id}&_expand=provider`
    )
      .then((response) => response.json())
      .then((data) => {
        setRelationships(data);
      });
  }, [providers]);

  const handleDeleteButton = (relationshipId) => {
    fetch(
      `http://localhost:8088/providerPatientRelationships/${relationshipId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then(() => {
        // Refetch the provider relationships after successful deletion
        fetch(
          `http://localhost:8088/providerPatientRelationships?patientId=${currentPatient.id}&_expand=provider`
        )
          .then((response) => response.json())
          .then((data) => {
            setRelationships(data);
          });
      });
  };

  return (
    <div className="bg-white h-screen">
      <div className="flex justify-center">
        <button
          className="mt-5 border-black border-2 w-30 px-2"
          onClick={() => {
            navigate("/ListAllProviders");
          }}
        >
          Find New Providers!
        </button>
      </div>
      <div className="w-screen">
        {myRelationships.map((myRelationship) => {
          return (
            <li className="list-none m-10 border-2 border-black p-5">
              <p className="mb-2 ">
                Name: {myRelationship?.provider?.fullName}
              </p>
              <p className="mb-2">
                Education: {myRelationship?.provider?.education}
              </p>
              <p className="mb-2">
                Specialty: {myRelationship?.provider?.specialty}
              </p>
              <button
                className="text-red-500 hover:text-red-900"
                onClick={() => handleDeleteButton(myRelationship.id)}
              >
                Leave Provider
              </button>
            </li>
          );
        })}
      </div>
    </div>
  );
};
