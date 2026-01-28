import { useState, useEffect } from "react";

import { useNavigate } from "react-router";

import '../App.css'

import Loading from "../Components/Loading";

export default function Home() {

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.removeItem("LB_DELIVERY")
  },[])

  function getTimerDelivery() {
    const now = new Date();

    const hora = now.getHours();
    const minutos = now.getMinutes();
    const segundos = now.getSeconds();

    console.log(`${hora >= 10 ? hora : `0${hora}`}:${minutos >= 10 ? minutos : `0${minutos}`}:${segundos >= 10 ? segundos : `0${segundos}`}`);

    localStorage.setItem("LB_DELIVERY", `${hora >= 10 ? hora : `0${hora}`}:${minutos >= 10 ? minutos : `0${minutos}`}:${segundos >= 10 ? segundos : `0${segundos}`}`)     
  }

  const [loading, setloading] = useState(false)
  const [driver, setDriver] = useState(localStorage.getItem('driver_lavanderia_brilhante') !== null ? localStorage.getItem('driver_lavanderia_brilhante') : 'Marcos')

  function toggleDriver(drv) {
    localStorage.setItem('driver_lavanderia_brilhante', drv)
    setDriver(drv)
  }

  return (
    <>
      {loading == true && (
        <Loading />
      )}
      <div
        className={`bg-[#fefefe] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0`}
      >
        <p className={`text-[36px] mb-14 leading-relaxed text-[#a591ef]`}>{driver}</p>
        
        <div className={`relative flex items-center justify-center w-[90%] rounded-3xl overflow-hidden border border-[#a591ef] shadow-2xl shadow-[#a591ef]`}>
          <p className={`${driver == 'vairton' ? 'left-0' : 'left-[50%]'} absolute w-[50%] opacity-[0.7] h-full text-center py-2 bg-[#a591ef] rounded-3xl px-12 transition-all duration-250ms`}></p>
          <p
            onClick={() => toggleDriver('vairton')}
            className={`${driver == 'vairton' ? 'text-black' : 'text-[#a591ef]'} grow h-full py-2 text-center transition-all duration-250`}
          >vairton</p>
          <p
            onClick={() => toggleDriver('geraldo')}
            className={`${driver == 'geraldo' ? 'text-black' : 'text-[#a591ef]'} grow h-full py-2 text-center transition-all duration-250`}
          >geraldo</p>
        </div>

        <div
          onClick={() => {
            getTimerDelivery()
            navigate('/deliveries')
          }}
          className={`text-[32px] font-bold border my-auto text-[#a591ef] border-[#a591ef] w-[80vw] h-[80vw] rounded-full flex items-center justify-center shadow-2xl shadow-[#a591ef]`}
        >
          iniciar
        </div>

        <p className={`fixed bottom-0 mb-6 border-[1.5px] text-[#a591ef] border-[#a591ef] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#a591ef]`}>
          placa - div8919
        </p>

      </div>
    </>
  )
}