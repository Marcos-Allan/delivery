
import { useState, useEffect } from "react";

import api from "../services/api";
import { ToastContainer, toast } from 'react-toastify';

import { FaTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

import Loading from "../Components/Loading";

import Menu from "../Components/Menu";
import Return from "../Components/Return";

export default function AdmUser() {

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("");
    const [userPosition, setUserPosition] = useState("");
    const [userGender, setUserGender] = useState("masculino");
    const [userID, setUserID] = useState("");

    function getEmployees() {
        api.get('/employees')
        .then((response) => {
            if(typeof response.data == "string"){
                setUsers([]);
                setLoading(false)
                return
            }else{
                setUsers(response.data);
                setLoading(false)
                return
            }
        })
        .catch((error) => {
            console.error('Error fetching employees:', error);
        });
    }

    function addUser() {
        api.post('/register-employee', {
	        name: userName,
	        position: userPosition,
	        gender: userGender
        })
        .then((response) => {
            console.log(response.data);
            getEmployees();
            setUserName("");
            setUserPosition("");
            setUserGender("masculino");

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error adding employee:', error);
        });
    }

    function deleteUser(id) {
        api.delete(`/delete-employee/${id}`)
        .then((response) => {
            getEmployees();

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error deleting employee:', error);
        });
    }

    function updateUser(id) {
        api.put(`/update-employee/${id}`, {
            name: userName,
            position: userPosition,
            gender: userGender
        })
        .then((response) => {
            getEmployees();
            setUserName("");
            setUserPosition("");
            setUserGender("masculino");
            setUserID("");

            if(response.data.type == "success") {
                notifySuccess(response.data.message)
            } else {
                notifyError(response.data.message)
            }
        })
        .catch((error) => {
            console.error('Error updating employee:', error);
        });
    }

    function handleUserName(e) {
        setUserName(e.target.value);
    }

    function handleUserPosition(e) {
        setUserPosition(e.target.value);
    }

    function handleUserGender(e) {
        setUserGender(e.target.value);
    }

    useEffect(() => {
        setLoading(true)
        getEmployees();
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
                            if(userID !== "") {
                                updateUser(userID);
                            } else {
                                addUser();
                            }
                        }}
                        className="flex flex-col items-center justify-center gap-4 mt-3"
                    >
                        <input
                            type="text"
                            value={userName}
                            onChange={handleUserName}
                            placeholder="Nome Funcionário"
                            className={`border px-3 py-2 rounded-md w-[90vw]`}
                        />
                        <input
                            type="text"
                            value={userPosition}
                            onChange={handleUserPosition}
                            placeholder="Cargo Funcionário"
                            className={`border px-3 py-2 rounded-md w-[90vw]`}
                        />
                        <select
                            value={userGender}
                            onChange={handleUserGender}
                            className={`border px-3 py-2 rounded-md w-[90vw]`}
                        >
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                        </select>
                        <input
                            type="submit"
                            value={`${userID !== "" ? 'Atualizar' : 'Adicionar'} Funcionário`}
                            className={`${userID !== "" ?'bg-yellow-500' :  'bg-green-500'} text-white px-4 py-2 rounded-md cursor-pointer w-[90vw] font-bold text-[20px]`}
                        />
                    </form>
                    <div className={`w-[90vw] flex flex-wrap items-center justify-start gap-1 mt-2 `}>
                        {typeof users !== 'string' && users.length >= 1 && users.map((user, i) => (
                            <div key={i} className={`border p-4 rounded-md w-[90vw] grow md:w-[49.71%] relative ${userID == user._id && 'bg-yellow-500'}`}>
                                <p><strong>Nome:</strong> {user.name}</p>
                                <p><strong>Cargo:</strong> {user.position}</p>
                                <p><strong>Gênero:</strong> {user.gender}</p>
                                <div
                                    onClick={() => {
                                        if(userID == user._id){
                                            setUserID("")
                                            setUserName("")
                                            setUserPosition("")
                                            setUserGender("Masculino")
                                        }else{
                                            setUserID(user._id)
                                            setUserName(user.name)
                                            setUserPosition(user.position)
                                            setUserGender(user.gender)
                                        }
                                    }}
                                    className={`absolute top-0 right-0 m-1 text-white rounded-md cursor-pointer bg-yellow-500 py-2 px-2 mr-10.5`}
                                >
                                    <FaEdit className="text-white" />
                                </div>
                                <div
                                    onClick={() => deleteUser(user._id)}
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