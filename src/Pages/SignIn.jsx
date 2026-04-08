//IMPORTACAO DAS BIBLIOTECAS NECESSARIAS PARA RODAR A APLICACAO
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router';
import styled, { keyframes } from 'styled-components';

//IMPORTACAO DOS ICONES
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

//IMPORTACAO DOS COMPONENTES
import Return from "../Components/Return";

//IMPORTAÇÃO DO GERENCIAMENTO DE ESTADO GLOBAL
import useUserStore from '../services/useStore';

//ANIMACOES
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

//ESTILOS
const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F6F6FA;
  position: relative;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Bubble = styled.div`
  position: absolute;
  background: rgba(87, 73, 184, 0.08);
  border-radius: 50%;
  z-index: 1;
`;

const LoginCard = styled.div`
  background: #ffffff;
  width: 340px;
  padding: 50px 35px;
  border-radius: 45px; /* Visual gordinho */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
  text-align: center;
  z-index: 10;
`;

const MachineContainer = styled.div`
  animation: ${float} 3s ease-in-out infinite;
`;

const WashingMachine = styled.div`
  width: 70px;
  height: 85px;
  background: white;
  border: 4px solid #282252;
  border-radius: 15px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after { /* Detalhe do painel da máquina */
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 30px;
    height: 4px;
    background: #282252;
    border-radius: 2px;
  }
`;

const Door = styled.div`
  width: 45px;
  height: 45px;
  border: 4px solid #E0E0E0;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: #fdfdfd;
  margin-top: 10px;
`;

const Water = styled.div`
  position: absolute;
  width: 150%;
  height: 150%;
  background: rgba(87, 73, 184, 0.3);
  bottom: -60%;
  left: -25%;
  border-radius: 42%;
  animation: ${spin} 3s linear infinite;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 25px;
  border: 2px solid #F1F3F4;
  border-radius: 22px; /* Input gordinho */
  background: #F8FAFB;
  font-size: 15px;
  box-sizing: border-box;
  transition: all 0.3s;
  color: #455A64;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: #282252;
    background: white;
  }

  &::placeholder {
    text-transform: none;
  }
`;

const ToggleEye = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  user-select: none;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background-color: ${props => props.$loading ? '#5749b8' : (props.$success ? '#4CAF50' : (props.$error ? '#E62323' : '#282252'))};
  color: white;
  border: none;
  border-radius: 22px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(87, 73, 184, 0.2);
  margin-top: 10px;

  &:disabled {
    cursor: not-allowed;
  }
`;

export default function SignIn() {

  //UTILIZACAO DA BIBLIOTECA IMPORTADA
  const navigate = useNavigate()

  //VARIAVEIS DE CONTROLE DA APLICACAO
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const [nameInput, setNameInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  
  //VARIAVEL DE CONTROLE GLOBAL
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  //FUNCAO RESPONSAVEL POR FAZER A IMEDIACAO DO ENVIO DO FORMULARIO
  const handleSubmit = (e) => {

    //PREVINE O CARREGAMENTO DA PAGINA
    e.preventDefault();

    //MUDA O STATUS DA APLICACAO PARA 'loading'
    setStatus('loading');

    //FAZ A REQUISICAO DE LOGIN, PASSANDO O NOME E A SENHA DIGITADA NOS INPUTS
    api.post('/login', {
      name: nameInput.toLowerCase(),
      password: passwordInput
    })
    //AGUARDA RESPOSTA DO SERVIDOR NA VARIAVEL 'response'
    .then((response) => {
      //VERIFIA SE O TIPO DA RESPOSTA DO SERVIDOR RETORNADO E 'success'
      if(response.data.type == "success") {
          //DISPARA A MENSAGEM DE SUCESSO VINDA DO SERVIDOR NA TELA
          notifySuccess(response.data.message)
          //MUDA O STATUS DA APLICACAO PARA 'success'
          setStatus('success');
          //CHAMA UMA FUNCAO DEPOIS DE 1,5 SEGUNDOS QUE MUDA O ESTADO DA APLICACAO PARA 'idle'
          setTimeout(() => setStatus('idle'), 1500);
          //COLOCA NA VARIAVEL DE ESTADO GLOBAL O NOME O CARGO E O GENERO DO FUNCIONARIO(A)
          setUser({
            name: String(response.data.user.name).toUpperCase(),
            position: String(response.data.user.position).toUpperCase(),
            gender: String(response.data.user.gender).toUpperCase()
          })

          //CHAMA UMA FUNCAO DEPOIS DE 2,5 SEGUNDOS QUE VERIFICA SE O CARGO DO FUNCIONARIO E 'entregador'
          setTimeout(() => {
            if(String(response.data.user.position).toLowerCase() == 'entregador'){
              //REDIRECIONA O USUARIO PARA A PAGINA DE 'delivery'
              navigate('/delivery')
            }else{
              //REDIRECIONA O USUARIO PARA A PAGINA DE 'adm'
              navigate('/adm/user')
            }
          }, 2500);
        } else {
          //DISPARA A MENSAGEM DE ERRO VINDA DO SERVIDOR NA TELA
          notifyError(response.data.message)
          //MUDA O ESTADO DA APLICACAO PARA 'error'
          setStatus('error');
          //CHAMA UMA FUNCAO DEPOIS DE 1,5 SEGUNDOS E MUDA O ESTADO DA APLICACAO PARA 'idle'
          setTimeout(() => setStatus('idle'), 1500);
      }

    })
    .catch((error) => {
      //ESCREVE O ERRO NO CONSOLE
        console.log(error)
        //MUDA O ESTADO DA APLICACAO PARA 'error'
        setStatus('error');
        //CHAMA UMA FUNCAO DEPOIS DE 1,5 SEGUNDOS E MUDA O ESTADO DA APLICACAO PARA 'idle'
        setTimeout(() => setStatus('idle'), 1500);
    })
  };

  //FUNCAO RESPONSAVEL POR COLOCAR A MENSAGEM DE SUCESSO NA TELA
  const notifySuccess = (msg) => {
    toast.success(msg, {
      toastId: "pedido-confirmado",
      type: "success",
      theme: 'colored'
    })
  };
  
  //FUNCAO RESPONSAVEL POR COLOCAR A MENSAGEM DE ERRO NA TELA
  const notifyError = (msg) => {
    toast.error(msg, {
        toastId: "pedido-confirmado",
        type: "error",
        theme: 'colored'
    });
  }

  return (
    <Wrapper>
      {/* Bolhas decorativas no fundo */}
      <Bubble style={{ width: '120px', height: '120px', top: '10%', left: '15%' }} />
      <Bubble style={{ width: '180px', height: '180px', bottom: '5%', right: '10%' }} />
      <Return />

      <LoginCard>
        <MachineContainer>
          <WashingMachine>
            <Door>
              <Water />
            </Door>
          </WashingMachine>
        </MachineContainer>

        <h1 style={{ fontSize: '26px', color: '#333', marginBottom: '5px' }}>Brilhante</h1>
        <p style={{ fontSize: '14px', color: '#90A4AE', marginBottom: '30px' }}>Gestão de Lavanderia</p>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Nome de usuário"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha"
              value={passwordInput}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');

                if (onlyNums.length <= 6) {
                  setPasswordInput(onlyNums);
                }
              }}
              required 
            />
            <ToggleEye onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoMdEye/> : <IoMdEyeOff />}
            </ToggleEye>
          </InputGroup>

          <SubmitButton 
            type="submit" 
            $loading={status === 'loading'} 
            $success={status === 'success'}
            $error={status === 'error'}
            disabled={status !== 'idle'}
          >
            {status === 'idle' && 'ENTRAR'}
            {status === 'error' && 'ERRO!'}
            {status === 'loading' && 'LAVANDO DADOS... 🫧'}
            {status === 'success' && 'TUDO LIMPO! ✨'}
          </SubmitButton>
        </form>
      </LoginCard>
      <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          theme="colored"
      />
    </Wrapper>
  );
};