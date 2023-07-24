import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ListMyPatients = () => {
  //get current user
  const localCapstoneUser = localStorage.getItem("capstone_user");
  const capstoneUserObject = JSON.parse(localCapstoneUser);
  const navigate = useNavigate();
  // use states
  const [currentProvider,setCurrentProvider] = useState({})
  const [myRelationships, setMyRelationships] = useState([]);
  //use effect to get the current provider
  useEffect(() => {
    fetch(`http://localhost:8088/providers?userId=${capstoneUserObject.id}`)
     .then((response) => response.json())
     .then((data) => {
      setCurrentProvider(data[0]);
     });
   }, []);
   //use effect to get the current list of my relationships based on my id and expand to get properties of patient.
   useEffect(()=>{
    fetch(`http://localhost:8088/providerPatientRelationships?providerId=${currentProvider.id}&_expand=patient`)
   .then((response) =>response.json())
   .then((data) => {
    setMyRelationships(data)
   })
    },[currentProvider]);

    const handleDeleteButton = (relationshipId) => {
        fetch(`http://localhost:8088/providerPatientRelationships/${relationshipId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then(() => {
            // Refetch the provider relationships after successful deletion
            fetch(
              `http://localhost:8088/providerPatientRelationships?providerId=${currentProvider.id}&_expand=provider`
            )
              .then((response) => response.json())
              .then((data) => {
                setMyRelationships(data);
              });
          });
      };


    return (
        <div className="m-5 ">
            {myRelationships.map((relationship) => {
                return (
                    <ul className="mt-5 border-2 border-blue-500 p-2">
                        <li className=" text-lg font-semibold">Name: {relationship?.patient?.fullName}</li>
                        <li>Address: {relationship?.patient?.address}</li>
                        <li>Height: {relationship?.patient?.height} In</li>
                        <li>Weight: {relationship?.patient?.weight} Lbs</li>
                        <button className="text-red-500 hover:text-red-900" onClick={()=>{
                            handleDeleteButton(relationship.id)
                        }}>Refuse Patient</button>
                    </ul>
                )
            })}
        </div>
    )
}
