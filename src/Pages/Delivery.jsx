import { useState, useEffect } from "react";
import api from "../services/api";

import { useNavigate } from "react-router";

import '../App.css'

import Loading from "../Components/Loading";

import useUserStore from '../services/useStore';

export default function Delivery() {

  const navigate = useNavigate()

  function getTimerDelivery() {
    const now = new Date();

    const hora = now.getHours();
    const minutos = now.getMinutes();
    const segundos = now.getSeconds();

    console.log(`${hora >= 10 ? hora : `0${hora}`}:${minutos >= 10 ? minutos : `0${minutos}`}:${segundos >= 10 ? segundos : `0${segundos}`}`);

    localStorage.setItem("LB_DELIVERY", `${hora >= 10 ? hora : `0${hora}`}:${minutos >= 10 ? minutos : `0${minutos}`}:${segundos >= 10 ? segundos : `0${segundos}`}`)     
  }

  const user = useUserStore((state) => state.user);

  const [loading, setloading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [vehiclesID, setVehiclesID] = useState(0)
  const [licensePlate, setLicensePlate] = useState(localStorage.getItem('vehicle_lavanderia_brilhante') !== null ? localStorage.getItem('vehicle_lavanderia_brilhante') : 'Carregando')
  const [drivers, setDrivers] = useState([])
  const [indexDriver, setIndexDriver] = useState(localStorage.getItem('driver_index_lavanderia_brilhante') !== null ? localStorage.getItem('driver_index_lavanderia_brilhante') : 0)

  function getVehicles() {
    api.get('/vehicles')
    .then((res) => {
      console.log(res.data)
      res.data.map((item) => {  
        setVehicles(prev => [...prev, item])
        setLicensePlate(localStorage.getItem('vehicle_lavanderia_brilhante') !== null ? localStorage.getItem('vehicle_lavanderia_brilhante') : res.data[0].license_plate)
      })
    })
    .catch((err) => console.log(err))
  }

  function getDrivers() {
    api.get('/employees')
    .then((res) => {
      const deliveryes = res.data.filter(item => item.position === "entregador")
      console.log(deliveryes)
      setDrivers([])
      deliveryes.map((item) => {  
        console.log(item.name)
        setDrivers(prev => [...prev, item])
      })
    })
    .catch((err) => console.log(err))
  }

  useEffect(() => {
    if(user.position.toLowerCase() !== "entregador" && user.position.toLowerCase() !== 'dono'){
      navigate("/")
    }

    setloading(true)
    localStorage.removeItem("LB_DELIVERY")
    getVehicles()
    getDrivers()

    if(drivers.length >= 0 && vehicles.length >= 0) {
      setloading(false)
    }
  },[])

  function toggleDriver(index) {
    localStorage.setItem('driver_index_lavanderia_brilhante', index)
    localStorage.setItem('driver_lavanderia_brilhante', drivers[index].name)
    setIndexDriver(index)
  }

  return (
    <>
      {loading == true ? (
        <>
          <Loading />
        </>
      ) : (
        <div
          className={`bg-[#F6F6FA] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0`}
        >
          <p className={`text-[36px] mb-14 leading-relaxed text-[#282252]`}>{drivers[indexDriver]?.name || 'Driver'}</p>
          
          <div className={`relative flex items-center justify-center w-[90%] rounded-3xl overflow-hidden border border-[#282252] shadow-2xl shadow-[#282252]`}>
            <p className={`${indexDriver == 0 ? 'left-0' : 'right-0'} absolute w-[50%] opacity-[0.7] h-full text-center py-2 bg-[#282252] rounded-3xl px-12 transition-all duration-250ms`}></p>
            {drivers && drivers.map((item, index) => (
              <p
                onClick={() => toggleDriver(index)}
                className={`grow h-full py-2 text-center transition-all duration-250 text-black`}
              >{item.name}</p>
            ))}
          </div>

          <div
            onClick={() => {
              getTimerDelivery()
              navigate('/deliveries')
            }}
            className={`text-[32px] font-bold border my-auto text-[#282252] border-[#282252] w-[80vw] h-[80vw] rounded-full flex items-center justify-center shadow-2xl shadow-[#282252]`}
          >
            iniciar
          </div>

          <p
            onClick={() => {
              if(vehiclesID == 0) {
                setVehiclesID(1)
                localStorage.setItem('vehicle_lavanderia_brilhante', vehicles[1].license_plate)
                setLicensePlate(vehicles[1].license_plate)
              } else {
                setVehiclesID(0)    
                localStorage.setItem('vehicle_lavanderia_brilhante', vehicles[0].license_plate)
                setLicensePlate(vehicles[0].license_plate)
              }
            }} 
            className={`bg-[#F6F6FA] fixed bottom-0 mb-6 border-[1.5px] text-[#282252] border-[#282252] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#282252]`}
          >
            placa - {licensePlate}
          </p>

        </div>
      )}
    </>
  )
}