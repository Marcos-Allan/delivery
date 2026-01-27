import { useState, useEffect } from "react"
import { useParams } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router";

import { FaMapLocationDot } from "react-icons/fa6";

import '../App.css'

import Loading from "../Components/Loading";

export default function Order() {

  const navigate = useNavigate()

  const { id } = useParams();

  const [loading, setloading] = useState(false)
  const [time, setTime] = useState()
  const [driver, setDriver] = useState(localStorage.getItem('driver_lavanderia_brilhante') !== null ? localStorage.getItem('driver_lavanderia_brilhante') : 'Marcos')
  const [client, setClient] = useState({})

  useEffect(() => {
      getOrder()
      setTime(localStorage.getItem("LB_DELIVERY"))
      setDriver(localStorage.getItem("driver_lavanderia_brilhante"))
  },[])

  function getOrder() {
    if(id == 1) {
      setClient({
        nome: "1 Trousseau - shopping iguatemi",
        endereco: "rua teodoro sampaio n° 2461",
        pecas: [
          "Camisa social",
          "Camisa social",
          "Camisa social",
        ]
      })
    } else if(id == 2) {
      setClient({
        nome: "2 Trousseau - shopping iguatemi",
        endereco: "rua teodoro sampaio n° 2481",
        pecas: [
          "Calça social",
          "Calça social",
          "Calça social",
        ]
      })
    } else {
      setClient({
        nome: "3 Trousseau - shopping iguatemi",
        endereco: "rua teodoro sampaio n° 2469",
        pecas: [
          "Blusa social",
          "Blusa social",
          "Blusa social",
        ]
      })
    }
  }

  const notifySuccess = () => {
    toast.success("Pedido Entregue com Sucesso! ", {
      toastId: "pedido-confirmado",
      theme: 'colored'
    })

    setTimeout(() => {
      navigate('/deliveries')
    },3500)
  };
  
  const notifyError = () => toast.error("Destinatário Ausente, Pedido não Entregue! ", {
    toastId: "pedido-confirmado",
    theme: 'colored'
  });

  return(
    <>
      {loading == true && (
        <Loading />
      )}
      <div
        className={`bg-[#fefefe] w-dvw h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden`}
      >
        <p className={`text-[36px] mb-4 text-[#a591ef]`}>{driver}</p>
        <p className={`w-[90%] flex items-center justify-center mb-6 bg-[#a591ef] py-2.5 rounded-[30px] shadow-2xl shadow-[#a591ef] text-white`}>delivery iniciado ás {time}</p>
      
        <div className={`w-[90%] border border-[#a591ef] rounded-xl overflow-hidden shadow-2xl shadow-[#a591ef]`}>
          <div className={`w-full bg-[#a591ef] px-3 py-3 mb-2 shadow-2xl shadow-[#a591ef]`}>
            <p className={`mb-2 font-bold text-[16px] text-white`}>{client && client.nome && client.nome}</p>
            <div className={`flex items-center justify-start gap-2 text-[14px]`}>
              <FaMapLocationDot className={`text-[24px] text-white`} />
              <p className={`text-white font-light`}>{client && client.endereco && client.endereco}</p>
            </div>
          </div>
          <div>
            {client && client.pecas && client.pecas.map((peca) => (
            <div className={`pl-3 flex items-center justify-start gap-2`}>
              <div className={`bg-black w-1 h-1 rounded-full`}></div>
              <p>{peca}</p>
            </div>
            ))}
          </div>
          <div className={`mx-auto w-[90%] h-[0.1px] bg-black mt-6 mb-3`}>
          </div>
          <div
            onClick={notifySuccess}
            className={`w-[90%] mx-auto bg-[#a591ef] flex items-center justify-center py-3 rounded-3xl font-bold mb-3 shadow-2xl shadow-[#a591ef] text-white`}
          >
            confirmar entrega
          </div>
        </div>

        {loading == false && (
          <p className={`fixed bottom-0 mb-6 border-[1.5px] text-[#a591ef] border-[#a591ef] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#a591ef]`}>
            palca - div8919
          </p> 
        )}

      </div>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        theme="colored"
      />
    </>
    )
}