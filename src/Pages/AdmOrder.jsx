import { useState, useEffect } from "react";
import api from "../services/api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaTrashAlt, FaEdit, FaTimes, FaCloudUploadAlt, FaCheck } from "react-icons/fa";

import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import Return from "../Components/Return";
import useUserStore from '../services/useStore';

export default function AdmOrder() {

    const user = useUserStore((state) => state.user);

    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [orderID, setOrderID] = useState("");
    
    // Estados do Pedido (Geral)
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");
    const [address, setAddress] = useState("");
    const [client, setClient] = useState("");
    const [zone, setZone] = useState("");
    const [description, setDescription] = useState("");
    const [typeDelivery, setTypeDelivery] = useState("");

    // Estados para a Peça Individual e Upload
    const [clothesList, setClothesList] = useState([]); 
    const [tempDesc, setTempDesc] = useState("");
    const [tempImg, setTempImg] = useState("");
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // NOVO: Estado para controlar qual peça da lista estamos editando
    const [editIndex, setEditIndex] = useState(null);

    const CLOUD_NAME = "dgvxpeu0a"; 
    const UPLOAD_PRESET = "fotos_roupas"; 

    // 1. BUSCAR PEDIDOS DO BANCO
    async function getOrders() {
        try {
            const response = await api.get('/orders');
            const data = Array.isArray(response.data) ? response.data : [];
            setOrders(data);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            notifyError("ERRO AO CARREGAR LISTA");
        } finally {
            setLoading(false);
        }
    }

    // 2. UPLOAD PARA CLOUDINARY (FOTO)
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET); 
            formData.append('tags', 'roupas');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            const data = await response.json();
            if (data.secure_url) {
                setTempImg(data.secure_url);
                notifySuccess("IMAGEM CARREGADA!");
            }
        } catch (error) {
            console.error('ERRO CLOUDINARY:', error);
            notifyError("ERRO NO UPLOAD");
        } finally {
            setIsUploading(false);
        }
    };

    // 3. ADICIONAR OU ATUALIZAR PEÇA NA LISTA LOCAL
    function handleAddOrUpdateClothe() {
        if (!tempDesc || !tempImg) return notifyError("FALTA DESCRIÇÃO OU FOTO!");
        
        const newItem = {
            client: client || "CLIENTE",
            description: tempDesc,
            image: tempImg
        };

        if (editIndex !== null) {
            // Se o index existe, estamos editando uma peça que já estava na lista
            const updatedList = [...clothesList];
            updatedList[editIndex] = newItem;
            setClothesList(updatedList);
            setEditIndex(null); // Sai do modo de edição
            notifySuccess("PEÇA ATUALIZADA NA LISTA!");
        } else {
            // Se for null, adicionamos uma nova
            setClothesList([...clothesList, newItem]);
        }

        // Limpa os campos de entrada de peça
        setTempDesc("");
        setTempImg("");
        setPreview(null);
    }

    // 4. PREPARAR UMA PEÇA DA LISTA PARA SER EDITADA
    function prepareClotheEdit(index) {
        const item = clothesList[index];
        setTempDesc(item.description);
        setTempImg(item.image);
        setPreview(item.image);
        setEditIndex(index); // Salva a posição que estamos mexendo
        window.scrollTo({ top: 150, behavior: 'smooth' }); // Sobe a tela para o formulário
    }

    // 5. SALVAR PEDIDO COMPLETO NO BANCO (BOTÃO VERDE)
    async function handleSubmit(e) {
        e.preventDefault();
        
        if (clothesList.length === 0) return notifyError("ADICIONE PELO MENOS UMA PEÇA!");

        const payload = {
            location, status, address, client, zone, description,
            type_delivery: typeDelivery,
            clothes: JSON.stringify(clothesList), // Envia a lista como String JSON
        };

        try {
            setLoading(true);
            if (orderID !== "") {
                await api.put(`/update-order/${orderID}`, payload);
            } else {
                await api.post('/register-order', payload);
            }
            notifySuccess("PEDIDO SALVO COM SUCESSO!");
            resetForm();
            getOrders();
        } catch (err) {
            console.error("ERRO AO SALVAR:", err);
            notifyError("ERRO AO SALVAR NO BANCO");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setOrderID(""); setLocation(""); setStatus(""); setAddress("");
        setClient(""); setClothesList([]); setZone(""); setEditIndex(null);
        setDescription(""); setTypeDelivery(""); setTempDesc(""); setTempImg("");
        setPreview(null);
    }

    useEffect(() => {
        if(user.position.toLowerCase() !== "auxiliar adm" && user.position.toLowerCase() !== 'dono'){
            navigate("/")
        }
        getOrders();
    }, []);

    const notifySuccess = (msg) => toast.success(msg, { theme: 'colored' });
    const notifyError = (msg) => toast.error(msg, { theme: 'colored' });

    return (
        <>
            {loading ? <Loading /> : (
                <div className="bg-[#F6F6FA] w-dvw min-h-dvh flex flex-col items-center px-4 py-8 uppercase absolute top-0 left-0 text-black overflow-x-hidden pb-24">
                    <Return />
                    
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-3">
                        <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="NOME DO CLIENTE" className="border px-3 py-2 rounded-md w-[90vw] outline-none" required />
                        
                        {/* SEÇÃO DE ROUPAS (DINÂMICA) */}
                        <div className={`border-2 border-black p-4 rounded-md w-[90vw] flex flex-col gap-3 ${editIndex !== null ? 'border-blue-500 bg-blue-50' : ''}`}>
                            <h3 className="text-[10px] font-black">{editIndex !== null ? "EDITANDO PEÇA SELECIONADA" : "ADICIONAR PEÇAS AO PEDIDO"}</h3>
                            
                            <input type="text" value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} placeholder="DESCRIÇÃO (EX: CAMISA AZUL P)" className="border px-3 py-2 rounded-md text-sm outline-none bg-white" />
                            
                            <label className="border-2 border-dashed border-gray-300 p-2 rounded-md flex flex-col items-center justify-center cursor-pointer min-h-16 bg-white">
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                {preview ? <img src={preview} alt="Preview" className="h-16 rounded-md" /> : <div className="flex flex-col items-center text-gray-400"><FaCloudUploadAlt /><span className="text-[9px]">FOTO</span></div>}
                            </label>

                            <button 
                                type="button" 
                                onClick={handleAddOrUpdateClothe} 
                                className={`py-2 rounded font-bold text-[10px] text-white ${editIndex !== null ? 'bg-blue-600' : 'bg-gray-800'}`}
                            >
                                {editIndex !== null ? "CONFIRMAR ALTERAÇÃO NA PEÇA" : "+ INCLUIR NA LISTA"}
                            </button>

                            {/* LISTA VISUAL DAS PEÇAS QUE ESTÃO SENDO ADICIONADAS */}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {clothesList.map((item, index) => (
                                    <div key={index} className="border border-black px-2 py-1 rounded flex items-center gap-2 text-[8px] font-bold ">
                                        <img src={item.image} className="w-5 h-5 rounded object-cover" />
                                        <span>{item.description}</span>
                                        <div className="flex gap-2 ml-2">
                                            <FaEdit className="text-blue-600 cursor-pointer" onClick={() => prepareClotheEdit(index)} />
                                            <FaTimes className="text-red-500 cursor-pointer" onClick={() => setClothesList(clothesList.filter((_, i) => i !== index))} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CAMPOS GERAIS DO PEDIDO */}
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="LOCAL DE ENTREGA" className="border px-3 py-2 rounded-md w-[90vw]" required />
                        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="STATUS (PENDENTE, PRONTO...)" className="border px-3 py-2 rounded-md w-[90vw]" />
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ENDEREÇO COMPLETO" className="border px-3 py-2 rounded-md w-[90vw]" required />
                        <input type="text" value={zone} onChange={(e) => setZone(e.target.value)} placeholder="ZONA / REGIÃO" className="border px-3 py-2 rounded-md w-[90vw]" required />
                        <input type="text" value={typeDelivery} onChange={(e) => setTypeDelivery(e.target.value)} placeholder="TIPO DELIVERY (MOTO, RETIRADA...)" className="border px-3 py-2 rounded-md w-[90vw]" required />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="OBSERVAÇÕES GERAIS" className="border px-3 py-2 rounded-md w-[90vw] text-sm" rows="2" />

                        <button type="submit" className={`w-[90vw] py-4 rounded-md font-black text-white outline-0 transition-all active:translate-y-1 ${orderID ? 'bg-yellow-500' : 'bg-green-600'}`}>
                            {orderID ? "ATUALIZAR PEDIDO NO BANCO" : "FINALIZAR E SALVAR PEDIDO"}
                        </button>
                    </form>

                    {/* LISTA DE PEDIDOS JÁ CADASTRADOS NO BANCO */}
                    <div className="w-[90vw] flex flex-col gap-4 mt-12">
                        <h2 className="text-center border-b-2 pb-2">PEDIDOS ATIVOS</h2>
                        {orders.length === 0 ? (
                            <p className="text-center text-[10px]">Nenhum pedido no sistema.</p>
                        ) : (orders.map((order) => (
                                <div key={order._id} className="border-2 border-black p-3 rounded-md bg-white relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[11px] font-black text-blue-800">{order.client}</p>
                                            <p className="text-[9px] font-bold text-gray-500">{order.location} | <span className="text-red-600">{order.status}</span></p>
                                        </div>
                                        <div className="bg-black text-white text-[8px] px-2 py-1 rounded font-bold">{order.zone}</div>
                                    </div>
                                    
                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                        {JSON.parse(order.clothes || "[]").map((c, i) => (
                                            <img key={i} src={c.image} className="w-10 h-10 rounded border-2 border-black object-cover shrink-0" alt="item" />
                                        ))}
                                    </div>

                                    <div className="flex gap-6 mt-4 justify-end border-t pt-2">
                                        <button onClick={() => {
                                            setOrderID(order._id); setClient(order.client); setLocation(order.location);
                                            setStatus(order.status); setAddress(order.address); setZone(order.zone);
                                            setDescription(order.description); setTypeDelivery(order.type_delivery);
                                            setClothesList(JSON.parse(order.clothes || "[]"));
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }} className="text-blue-700 flex items-center gap-1 font-bold text-[10px]">
                                            <FaEdit /> EDITAR
                                        </button>
                                        <button onClick={async () => {
                                            await api.delete(`/delete-order/${order._id}`);
                                            getOrders();
                                            notifySuccess("EXCLUÍDO!");
                                        }} className="text-red-600 flex items-center gap-1 font-bold text-[10px]">
                                            <FaTrashAlt /> EXCLUIR
                                        </button>
                                    </div>
                                </div>
                        )))}
                    </div>

                    <ToastContainer autoClose={2000} />
                    <Menu />
                </div>
            )}
        </>
    );
}