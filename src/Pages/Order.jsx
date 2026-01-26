import { useState, useEffect } from "react"
import { useParams } from "react-router";

import { FaMapLocationDot } from "react-icons/fa6";

import '../App.css'

import loadingImage from '../assets/loading.gif'

export default function Order() {

  const { id } = useParams();

  const [time, setTime] = useState()
  const [client, setClient] = useState({})

  useEffect(() => {
      getOrder()
      setTime(localStorage.getItem("LB_DELIVERY"))
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

    return(
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-200 to-blue-500">
      
        <img
          src={loadingImage}
          alt="Carregando"
          className="w-56 md:w-72 animate-bounce drop-shadow-lg rounded"
        />

        <p className="mt-6 text-2xl font-bold text-blue-900 animate-pulse">
          Carregando...
        </p>
      </div>

      <div
        className={`bg-[#fefefe] w-dvw h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden`}
      >
        <p className={`text-[36px] mb-4`}>vairton</p>
        <p className={`w-[90%] flex items-center justify-center mb-6 bg-[#a591ef] py-2.5 rounded-[30px]`}>delivery iniciado ás {time}</p>
      
        <div className={`w-[90%] border border-[#a591ef] rounded-xl overflow-hidden`}>
          <div className={`w-full bg-[#a591ef] px-3 py-3 mb-2`}>
            <p className={`mb-2 font-bold text-[16px]`}>{client && client.nome && client.nome}</p>
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
          <div className={`w-[90%] mx-auto bg-[#a591ef] flex items-center justify-center py-3 rounded-3xl font-bold mb-3`}>
            confirmar entrega
          </div>
        </div>
        <p className={`fixed bottom-0 mb-6 border border-black w-[90%] py-4 flex items-center justify-center rounded-[60px]`}>
          palca - div8919
        </p>
      </div>
    </>
    )
}