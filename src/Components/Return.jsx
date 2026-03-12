import { useEffect } from "react";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router";

export default function Return() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Verifica quem foi a "Página Anterior" que se registrou no banco
    const anterior = sessionStorage.getItem("pagina_anterior");

    // 2. Define a sua variável isHome
    // Ela será true se a última rota acessada foi '/'
    const isHome = anterior === '/';

    useEffect(() => {
        // 3. Antes de sair desta página atual, ela se registra como "anterior"
        // para que a próxima página saiba de onde veio
        return () => {
            sessionStorage.setItem("pagina_anterior", location.pathname);
        };
    }, [location.pathname]);

    // Se for a Home ou se veio da Home, não renderiza nada
    if (location.pathname === '/' || isHome) {
        return null;
    }

    return (
        <div
            onClick={() => navigate(-1)}
            className="absolute top-0 left-0 p-2 text-black text-[30px] cursor-pointer"
        >
            <IoReturnDownBackSharp />
        </div>
    );
}