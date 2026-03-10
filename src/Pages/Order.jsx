import { useState, useEffect } from "react"
import { useParams } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router";

import { FaMapLocationDot } from "react-icons/fa6";

import '../App.css'

import Loading from "../Components/Loading";
import api from "../services/api";

export default function Order() {

  const navigate = useNavigate()

  const { id } = useParams();

  const [loading, setloading] = useState(true)
  const [time, setTime] = useState()
  const [driver, setDriver] = useState(localStorage.getItem('driver_lavanderia_brilhante') !== null ? localStorage.getItem('driver_lavanderia_brilhante') : 'Marcos')
  const [client, setClient] = useState({})
  const [clothes, setClothes] = useState()
  const [licensePlate, setLicensePlate] = useState(localStorage.getItem('vehicle_lavanderia_brilhante') !== null ? localStorage.getItem('vehicle_lavanderia_brilhante') : 'Crregando')

  useEffect(() => {
      setloading(true)
      getOrder()
      setTime(localStorage.getItem("LB_DELIVERY"))
      setDriver(localStorage.getItem("driver_lavanderia_brilhante"))
  },[])

  function getOrder() {
    setloading(true)
    
    api.get(`/get-order/${id}`)
    .then((res) => {
      console.log(res.data.order)
      setClient(res.data.order)
      setClothes(JSON.parse(res.data.order.clothes))
      console.log(id)
      setloading(false)
    })
    .catch((err) => console.log(err))
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
      {loading == true ? (
        <Loading />
      ) : (
        <div
          className={`bg-[#fefefe] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0 pb-24`}
        >
          <p className={`text-[36px] mb-4 text-[#a591ef]`}>{driver}</p>
          <p className={`w-[90%] flex items-center justify-center mb-6 bg-[#a591ef] py-2.5 rounded-[30px] shadow-2xl shadow-[#a591ef] text-white`}>delivery iniciado ás {time}</p>
        
          <div className={`w-[90%] border border-[#a591ef] rounded-xl overflow-hidden shadow-2xl shadow-[#a591ef]`}>
            <div className={`w-full bg-[#a591ef] px-3 py-3 mb-2 shadow-2xl shadow-[#a591ef]`}>
              <p className={`mb-2 font-bold text-[16px] text-white`}>{client && client.client && client.client} - {client && client.location && client.location}</p>
              <div className={`flex items-center justify-start gap-2 text-[14px]`}>
                <FaMapLocationDot className={`text-[24px] text-white`} />
                <p className={`text-white font-light`}>{client && client.address && client.address}</p>
              </div>
            </div>
            <div className={`p-2`}>
              {clothes && clothes.length >= 1 && clothes.map((clothe) => (
                <div>
                  {clothe.cdivent}
                  <img className={`mx-auto my-auto w-50 h-50`} src={clothe.image} alt={"imagem da roupa"} />
                  {clothe.description}
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
          
          <div
            onClick={notifyError}
            className={`w-[90%] mt-8 mx-auto bg-[#e81d1d] flex items-center justify-center py-3 rounded-3xl font-bold mb-3 shadow-2xl shadow-[#a591ef] text-white`}
          >
            cliente ausente
          </div>

          {loading == false && (
            <p className={`fixed bottom-0 mb-6 border-[1.5px] text-[#a591ef] border-[#a591ef] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#a591ef]`}>
              placa - {licensePlate}
            </p> 
          )}

          <ToastContainer
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            theme="colored"
          />
        </div>
      )}
    </>
    )
}