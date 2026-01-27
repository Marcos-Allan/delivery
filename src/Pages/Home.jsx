import { useState, useEffect } from "react";

import { useNavigate } from "react-router";

import '../App.css'

import Loading from "../Components/Loading";

export default function Home() {

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.clear("LB_DELIVERY")
    console.log(localStorage.getItem("LB_DELIVERY"))
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

  return (
    <>
      {loading == true && (
        <Loading />
      )}
      <div
        className={`bg-[#fefefe] w-dvw h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden`}
      >
        <p className={`text-[36px] mb-14 leading-relaxed text-[#a591ef]`}>vairton</p>
        <div className={`relative flex items-center justify-center w-[90%] rounded-3xl overflow-hidden border border-[#a591ef] shadow-2xl shadow-[#a591ef]`}>
          <p className={`left-0 absolute w-[50%] opacity-[0.7] h-full text-center py-2 bg-[#a591ef] rounded-3xl px-12`}></p>
          <p className={`text-black grow h-full py-2 pr-12 text-right`}>vairton</p>
          <p className={`text-[#a591ef] grow h-full py-2 pr-12 text-right`}>geraldo</p>
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
          palca - div8919
        </p>

      </div>
    </>
  )
}