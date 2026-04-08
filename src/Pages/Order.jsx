//IMPORTACAO DAS BIBLIOTECAS NECESSARIAS PARA RODAR A APLICACAO
import { useState, useEffect } from "react"
import api from "../services/api";
import { useParams } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router";

//IMPORTACAO DOS ICONES
import { FaMapLocationDot } from "react-icons/fa6";

//IMPORTACAO DO ESTILO GERAL DA APLICACAO
import '../App.css'

//IMPORTACAO DOS COMPONENTES
import Loading from "../Components/Loading";
import Return from "../Components/Return";

export default function Order() {

  //UTILIZACAO DA BIBLIOTECA IMPORTADA
  const navigate = useNavigate()

  //PEGA O PARAMETRO PASSADO POR URL
  const { id } = useParams();

  //VARIAVEIS DE CONTROLE DA APLICACAO
  const [loading, setloading] = useState(true)
  const [time, setTime] = useState()
  const [driver, setDriver] = useState(localStorage.getItem('driver_lavanderia_brilhante') !== null ? localStorage.getItem('driver_lavanderia_brilhante') : 'Marcos')
  const [client, setClient] = useState({})
  const [clothes, setClothes] = useState()
  const [licensePlate, setLicensePlate] = useState(localStorage.getItem('vehicle_lavanderia_brilhante') !== null ? localStorage.getItem('vehicle_lavanderia_brilhante') : 'Crregando')

  //FUNCAO CHAMADA TODA VEZ QUE A PAGINA E RECARREGADA
  useEffect(() => {
      //COLOCA O ESTADO DE CARREGAMENTO DA APLICACAO COMO 'true'
      setloading(true)
      //CHAMA A FUNCAO QUE PEGA OS PEDIDOS
      getOrder()
      //SETA O TEMPO QUE O DELIVERY COMECOU PEGANDO DO localStorage
      setTime(localStorage.getItem("LB_DELIVERY"))
      //SETA O NOME DO MOTORISTA NO localStorage
      setDriver(localStorage.getItem("driver_lavanderia_brilhante"))
  },[])

  //FUNCAO RESPONSAVEL POR PEGAR OS PEDIDOS
  function getOrder() {
    //MUDA O ESTADO DE CARREGAMENTO DA PAGINA PARA 'true'
    setloading(true)
    //FAZ A REQUISICAO NA API PARA PEGAR O PEDIDO PELO ID PASSADO POR PARAMETRO NA PAGINA
    api.get(`/get-order/${id}`)
    //AGUARDA A RESPOSTA DO SERVIDOR
    .then((res) => {
      //ESCREVE NO CONSOLE O PEDIDO VINDO DA RESPOSTA DO SERVIDOR
      console.log(res.data.order)
      //COLOCA O PEDIDO VINDO DO SERVIDOR NA VARIAVEL DE CONTROLE 'client'
      setClient(res.data.order)
      //COLOCA AS ROUPAS NA VARIAVEL DE CONTROLE 'clothes'
      setClothes(JSON.parse(res.data.order.clothes))
      //ESCREVE O 'id' PASSADO NA URL COMO PARAMETRO NO CONSOLE
      console.log(id)
      //MUDA O ESTADO DE CARREGAMENTO DA PAGINA PARA 'false'
      setloading(false)
    })
    //ESCREVE O ERRO NO CONSOLE
    .catch((err) => console.log(err))
  }

  //FUNCAO RESPONSAVEL POR COLOCAR A MENSAGEM DE SUCESSO NA TELA
  const notifySuccess = () => {
    toast.success("Pedido Entregue com Sucesso! ", {
      toastId: "pedido-confirmado",
      theme: 'colored'
    })

    //CHAMA UMA FUNCAO DEPOIS DE 3,5 SEGUNDOS
    setTimeout(() => {
      //REDIRECIONA O USUARIO PARA A PAGINA DE 'deliveries'
      navigate('/deliveries')
    },3500)
  };
  
  //FUNCAO RESPONSAVEL POR COLOCAR A MENSAGEM DE ERRO NA TELA
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
          className={`bg-[#F6F6FA] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0 pb-24`}
        >
          <Return />
          <p className={`text-[36px] mb-4 text-[#282252]`}>{driver}</p>
          <p className={`w-[90%] flex items-center justify-center mb-6 bg-[#282252] py-2.5 rounded-[30px] shadow-2xl shadow-[#282252] text-white`}>delivery iniciado ás {time}</p>
        
          <div className={`w-[90%] border border-[#282252] rounded-xl overflow-hidden shadow-2xl shadow-[#282252]`}>
            <div className={`w-full bg-[#282252] px-3 py-3 mb-2 shadow-2xl shadow-[#282252]`}>
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
              className={`w-[90%] mx-auto bg-[#282252] flex items-center justify-center py-3 rounded-3xl font-bold mb-3 shadow-2xl shadow-[#282252] text-white`}
            >
              confirmar entrega
            </div>
          </div>
          
          <div
            onClick={notifyError}
            className={`w-[90%] mt-8 mx-auto bg-[#e81d1d] flex items-center justify-center py-3 rounded-3xl font-bold mb-3 shadow-2xl shadow-[#282252] text-white`}
          >
            cliente ausente
          </div>

          {loading == false && (
            <p className={`bg-[#F6F6FA] fixed bottom-0 mb-6 border-[1.5px] text-[#282252] border-[#282252] w-[90%] py-4 flex items-center justify-center rounded-[60px] shadow-2xl shadow-[#282252]`}>
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