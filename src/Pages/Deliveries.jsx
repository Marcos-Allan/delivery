//IMPORTAÇÃO DAS  BILBIOTECAS
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router";

//IMPORTAÇÃO DOS ÍCONES
import { FaMapLocationDot } from "react-icons/fa6";

//IMPORTAÇÃO DOS COMPONENTES
import Loading from "../Components/Loading";

export default function Deliveries() {

    //UTILIZAÇÃO DA BIBLIOTECA DE NAVEGAÇÃO
    const navigate = useNavigate()

    //UTILIZAÇÃO DE ESTADOS PARA CONTROLAR AS VARIÁVEIS DO COMPONENTE
    const [time, setTime] = useState()
    const [driver, setDriver] = useState(localStorage.getItem('driver_lavanderia_brilhante') !== null ? localStorage.getItem('driver_lavanderia_brilhante') : 'Marcos')
    const [loading, setloading] = useState(true)
    const [orders, setOrders] = useState([])
    const [licensePlate, setLicensePlate] = useState(localStorage.getItem('vehicle_lavanderia_brilhante') !== null ? localStorage.getItem('vehicle_lavanderia_brilhante') : 'Crregando')

    //FUNÇÃO RESPONSÁVEL POR TENTA PEGARR OS PEDIDOS DDO 
    function getOrders() {
        api.get('/orders')
        .then((res) => {
            console.log(res.data)
            if(typeof res.data !== "string") {
                setOrders(res.data)
                setloading(false)
            }else{
                setloading(false)
                return
            }
        })
        .catch((err) => console.log(err))
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE O COMPONENTE É RENDERIZADO, PARA PEGAR AS INFORMAÇÕES DO PEDIDO E DO MOTORISTA
    useEffect(() => {
        setloading(true)
        setTime(localStorage.getItem("LB_DELIVERY"))
        setDriver(localStorage.getItem("driver_lavanderia_brilhante"))
        getOrders()
    },[])

  return (
    <>
        {loading == true ? (
            <Loading />
        ) : (
            <div
                className={`bg-[#fefefe] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0`}
            >
                <p className={`text-[36px] mb-4 leading-relaxed text-[#a591ef]`}>{driver}</p>
                <p className={`w-[90%] flex items-center justify-center mb-6 bg-[#a591ef] py-2.5 rounded-[30px] shadow-2xl shadow-[#a591ef] text-white`}>delivery iniciado ás {time}</p>
            
                <div className={`w-[90%] flex items-center mb-4 text-[#a591ef]`}>
                    <div className={`bg-[#a591ef] grow h-[0.2px]`}></div>
                    <p className={`px-4`}>a entregar</p>
                    <div className={`bg-[#a591ef] grow h-[0.2px]`}></div>
                </div>
                    
                {orders && orders.length  >= 1 && orders.map((item) => (
                    <div
                        onClick={() => {
                            navigate(`/order/${item._id}`)
                        }}
                        className={`flex items-center justify-center w-[90%] bg-white h-20 px-3 py-2 rounded-xl border-2 border-[#a591ef] outline outline-white mb-4 shadow-2xl shadow-[#a591ef]`}
                    >
                        <FaMapLocationDot className={`w-[20%] text-[40px] text-[#a591ef] mr-4`} />
                        <div className={`flex flex-col items-start justify-between truncate w-[80%]`}>
                            <p className={`font-bold truncate text-[#a591ef] text-[16px] mb-1`}>{item.client} - {item.location}</p>
                            <p className={`font-lighttruncate text-[#a591ef] text-[12px]`}>rua teodoro sampaio nº 2481</p>
                        </div>
                    </div>
                ))}

                <div className={`w-[90%] flex items-center mb-4 text-[#a591ef]`}>
                    <div className={`bg-[#a591ef] grow h-[0.2px]`}></div>
                    <p className={`px-4`}>entregue</p>
                    <div className={`bg-[#a591ef] grow h-[0.2px]`}></div>
                </div>

                {orders && orders.length >= 1 && orders.map((item) => (
                    <div
                        onClick={() => {
                            navigate(`/order/${item._id}`)
                        }}
                        className={`flex items-center justify-center w-[90%] bg-[#a591ef] h-20 px-3 py-2 rounded-xl border-2 border-[#a591ef] outline outline-white mb-4 shadow-2xl shadow-[#a591ef]`}
                    >
                        <FaMapLocationDot className={`w-[20%] text-[40px] text-white mr-4`} />
                        <div className={`flex flex-col items-start justify-between truncate w-[80%]`}>
                            <p className={`font-bold truncate text-white text-[16px] mb-1`}>trousseau - shopping iguatemi</p>
                            <p className={`font-lighttruncate text-white text-[12px]`}>rua teodoro sampaio nº 2469</p>
                        </div>
                    </div>
                ))}
                

                <p className={`fixed bottom-0 mb-6 border-[1.5px] text-[#a591ef] border-[#a591ef] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#a591ef]`}>
                    placa - {licensePlate}
                </p>
            </div>
        )}
    </>
  )
}