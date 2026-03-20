import { FaBook } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { IoShirtSharp } from "react-icons/io5";

import { useLocation, useNavigate } from "react-router";

export default function Menu() {

    const navigate = useNavigate();
    const location = useLocation();

    console.log(location.pathname);

    return (
        <div className={`w-full h-15 flex items-center justify-around text-[34px] bg-white border border-t-2 border-gray-300 text-gray-600 fixed bottom-0 left-0 py-4`}>
            <FaUserAlt
                onClick={() => navigate('/adm/user')}
                className={`${location.pathname == "/adm/user" && "text-green-500"}`}
            />
            <FaCar
                onClick={() => navigate('/adm/vehicle')}
                className={`${location.pathname == "/adm/vehicle" && "text-green-500"}`}
            />
            <IoShirtSharp
                onClick={() => navigate('/adm/clothes')}
                className={`${location.pathname == "/adm/clothes" && "text-green-500"}`}
            />
            <FaBook
                onClick={() => navigate('/adm/orders')}
                className={`${location.pathname == "/adm/orders" && "text-green-500"}`}
            />
        </div>
    )
}