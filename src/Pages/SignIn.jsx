import { useState } from 'react'
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

import Return from "../Components/Return";

export default function SignIn() {

    const [isVisible, setIsVisible] = useState(false)

    function togglePassword() {
        setIsVisible(!isVisible)
    }

    return(
        <div
            className={`bg-[#F6F6FA] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0`}
        >
            <Return />
            <h1 className={`m-3 font-bold text-[32px]`}>Login</h1>
            <p className={`mt-12`}>Faça login para poder continuar</p>

            <div className={`absolute top-[50%] left-[50%] w-[90vw] translate-[-50%] rounded-lg p-4`}>
                <input
                    type="text"
                    name=""
                    id=""
                    placeholder={`Insira seu nome`}
                    className={`w-full py-4 px-2 border border-black rounded-sm h-12.5`}
                />
                <div className={`mt-2 w-full border border-black flex items-center justify-center rounded-sm h-12.5`}>
                    <input
                        type={`${isVisible == true ? "text" : "password"}`}
                        name=""
                        id=""
                        placeholder={`${isVisible == true ? 'Insira sua Senha' : '*********'}`}
                        className={`py-3 px-2 grow outline-0`}
                    />
                    <div    
                        onClick={() => togglePassword()}
                        className={`p-3 text-[28px]`}
                    >
                        {isVisible == true ? (
                            <IoMdEye />
                        ) : (
                            <IoMdEyeOff />
                        )}
                    </div>
                </div>
                <div className={`w-full py-3 bg-green-500 rouded-sm flex items-center justify-center mt-3 rounded-sm font-bold text-[#F6F6FA]`}>
                    Login
                </div>
            </div>
        </div>
    )
}