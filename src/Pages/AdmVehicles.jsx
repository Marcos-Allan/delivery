
import { useState, useEffect } from "react";

import api from "../services/api";
import { ToastContainer, toast } from 'react-toastify';

import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import Return from "../Components/Return";

export default function AdmVehicles() {

    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState();
    const [vehicleID, setVehicleID] = useState("");
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState("");

    function getVehicles() {
        api.get('/vehicles')
        .then((response) => {
            if(typeof response.data == "string"){
                setVehicles([]);
                setLoading(false)
                return
            }else{
                setVehicles(response.data);
                setLoading(false)
            }
        })
        .catch((error) => {
            console.error('Error fetching vehicles:', error);
        });
    }

    function addVehicle() {
        api.post('/register-vehicle', {
            license_plate: vehicleLicensePlate
        })
        .then((response) => {
            console.log(response.data);
            getVehicles();
            setVehicleLicensePlate("");
            setVehicleID("");

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error adding vehicle:', error);
        });
    }

    function deleteVehicle(id) {
        api.delete(`/delete-vehicle/${id}`)
        .then((response) => {
            getVehicles();

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error deleting vehicle:', error);
        });
    }

    function updateVehicle(id) {
        api.put(`/update-vehicle/${id}`, {
            license_plate: vehicleLicensePlate
        })
        .then((response) => {
            getVehicles();
            setVehicleLicensePlate("");

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error updating vehicle:', error);
        });
    }

    function handleVehicleLicensePlate(e) {
        setVehicleLicensePlate(e.target.value);
    }

    useEffect(() => {
        setLoading(true)
        getVehicles();
    },[])

    const notifySuccess = (msg) => {
        toast.success(msg, {
          toastId: "pedido-confirmado",
          type: "success",
          theme: 'colored'
        })
    };
      
      const notifyError = (msg) => {
        toast.error(msg, {
            toastId: "pedido-confirmado",
            type: "error",
            theme: 'colored'
        });
    }

    return (
        <>
            {loading == true ? (
                <Loading />
            ) : (
                <div
                    className={`bg-[#F6F6FA] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0 text-black overflow-x-hidden pb-17.5`}
                >
                    <Return />
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if(vehicleID !== "") {
                                updateVehicle(vehicleID);
                            } else {
                                addVehicle();
                            }
                        }}
                        className="flex flex-col items-center justify-center gap-4 mt-3"
                    >
                        <input
                            type="text"
                            value={vehicleLicensePlate}
                            onChange={handleVehicleLicensePlate}
                            placeholder="Placa do Veículo"
                            className={`border px-3 py-2 rounded-md w-[90vw]`}
                        />
                        <input
                            type="submit"
                            value={`${vehicleID !== "" ? 'Atualizar' : 'Adicionar'} Veículo`}
                            className={`${vehicleID !== "" ? 'bg-yellow-500' : 'bg-green-500'} text-white px-4 py-2 rounded-md cursor-pointer w-[90vw] font-bold text-[20px]`}
                        />
                    </form>
                    <div className={`w-[90vw] flex flex-wrap items-center justify-start gap-1 mt-2`}>
                        {typeof vehicles !== "string" && vehicles.length >= 1 && vehicles.map((vehicle) => (
                            <div key={vehicle._id} className={`border p-4 rounded-md w-[90vw] grow md:w-[49.71%] relative ${vehicleID == vehicle._id && 'bg-yellow-500'}`}>
                                <p><strong>Placa:</strong> {vehicle.license_plate}</p>
                                <div
                                    onClick={() => {
                                        if(vehicleID == vehicle._id){
                                            setVehicleID("")
                                            setVehicleLicensePlate("")
                                        }else{
                                            setVehicleID(vehicle._id)
                                            setVehicleLicensePlate(vehicle.license_plate)
                                        }
                                    }}
                                    className={`absolute top-0 right-0 m-1 text-white rounded-md cursor-pointer bg-yellow-500 py-2 px-2 mr-10.5`}
                                >
                                    <FaEdit className="text-white" />
                                </div>
                                <div
                                    onClick={() => deleteVehicle(vehicle._id)}
                                    className={`absolute top-0 right-0 m-1 text-white rounded-md cursor-pointer bg-red-500 py-2 px-2`}
                                >
                                    <FaTrashAlt className="text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <ToastContainer
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        theme="colored"
                    />
                    <Menu />
                </div>
            )}
        </>
        
    )
}