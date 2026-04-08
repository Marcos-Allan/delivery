import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Return from "../Components/Return";
import { FaTrashAlt, FaCloudUploadAlt, FaCamera, FaTimes, FaFolder } from "react-icons/fa";
import axios from "axios";

// IMPORTAÇÕES DAS GALERIAS E CÂMERA
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

import useUserStore from '../services/useStore';

export default function AdmClothes() {
    const [clothes, setClothes] = useState([]); // Agora armazena os dados vindos do MongoDB
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [nomeRoupa, setNomeRoupa] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [pastaAberta, setPastaAberta] = useState(null); // Controle de navegação das pastas

    const user = useUserStore((state) => state.user);
    const CLOUD_NAME = "dgvxpeu0a";

    // 1. BUSCAR DADOS DO MONGODB (SUBSTITUIU O GET CLOUDINARY)
    async function getPhotos() {
        setLoading(true);
        try {
            const response = await axios.get('https://delivery-back-fcfh.onrender.com/get-photos');
            setClothes(response.data);
        } catch (error) {
            toast.error("Erro ao carregar galeria do banco");
        } finally {
            setLoading(false);
        }
    }

    // 2. EXCLUIR USANDO ID DO MONGO
    const handleDelete = async (idMongo) => {
        if (!window.confirm("Deseja apagar esta foto para todos?")) return;
        setLoading(true);
        try {
            await axios.delete(`https://delivery-back-fcfh.onrender.com/delete-photo/${idMongo}`);
            toast.success("Removido com sucesso!");
            getPhotos();
        } catch (error) {
            toast.error("Erro ao excluir");
        } finally {
            setLoading(false);
        }
    };

    // 3. SALVAR (CLOUDINARY + MONGODB)
    const handleSave = async (e) => {
        e.preventDefault();
        if (!imagem) return toast.error("Selecione ou tire uma foto");
        if (!nomeRoupa.trim()) return toast.error("Digite um nome para a roupa");

        setLoading(true);
        try {
            // A - Enviar para Cloudinary
            const formData = new FormData();
            formData.append('file', imagem);
            formData.append('upload_preset', "fotos_roupas");

            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: 'POST', body: formData
            });
            const cloudData = await cloudRes.json();

            // B - Se deu certo, enviar referência para o MongoDB
            if (cloudData.secure_url) {
                await axios.post('https://delivery-back-fcfh.onrender.com/register-photo', {
                    name: nomeRoupa.trim().toUpperCase(),
                    public_id: cloudData.public_id,
                    url: cloudData.secure_url
                });

                toast.success("Salvo na nuvem e no banco!");
                setPreview(null);
                setImagem(null);
                setNomeRoupa("");
                getPhotos();
            }
        } catch (error) {
            toast.error("Erro ao processar salvamento");
        } finally {
            setLoading(false);
        }
    };

    // LOGICA DE AGRUPAMENTO (PASTAS)
    const grupos = clothes.reduce((acc, item) => {
        const nomePasta = item.name.toUpperCase();
        if (!acc[nomePasta]) acc[nomePasta] = [];
        acc[nomePasta].push(item);
        return acc;
    }, {});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
            setShowCamera(false);
        }
    };

    const handleTakePhoto = (dataUri) => {
        fetch(dataUri).then(res => res.blob()).then(blob => {
            const file = new File([blob], `photo_${Date.now()}.png`, { type: "image/png" });
            setImagem(file);
            setPreview(dataUri);
            setShowCamera(false);
        });
    };

    useEffect(() => { getPhotos(); }, []);

    return (
        <div className="bg-[#F6F6FA] min-h-dvh pb-24 uppercase overflow-x-hidden absolute top-0 left-0 w-full font-sans">
            {loading && <Loading />}
            <Return />
            
            <form onSubmit={handleSave} className="flex flex-col items-center gap-4 pt-10 px-4">
                <h1 className="text-lg text-black mb-2 tracking-tighter font-black">Gerenciador de Pastas</h1>
                
                <input 
                    type="text"
                    value={nomeRoupa}
                    onChange={(e) => setNomeRoupa(e.target.value)}
                    placeholder="NOME DA PASTA / ROUPA"
                    className="w-full max-w-md p-4 rounded-xl border-4 border-black bg-white text-sm font-bold uppercase"
                    required
                />

                {showCamera ? (
                    <div className="relative w-full max-w-md border-4 border-black rounded-xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <Camera onTakePhoto={handleTakePhoto} idealFacingMode="environment" isImageMirror={false} />
                        <button type="button" onClick={() => setShowCamera(false)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full border-2 border-black z-10"><FaTimes size={18}/></button>
                    </div>
                ) : (
                    <div className="w-full max-w-md flex flex-col gap-2">
                        <button type="button" onClick={() => setShowCamera(true)} className="flex items-center justify-center gap-3 bg-black text-white w-full py-4 rounded-xl font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"><FaCamera size={20} />Tirar Foto</button>
                        <label className="border-4 border-dashed border-black p-4 rounded-xl w-full flex flex-col items-center bg-white cursor-pointer">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            {preview ? <img src={preview} className="max-h-44 rounded-lg border-2 border-black" /> : <FaCloudUploadAlt size={40} />}
                        </label>
                    </div>
                )}

                <button type="submit" className="bg-green-600 text-white w-full max-w-md py-4 rounded-xl font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">Salvar Tudo</button>
            </form>

            <PhotoProvider>
    '           <div className="flex flex-wrap gap-4 px-4 mt-16 justify-center">
                    {pastaAberta ? (
                        <>
                            {/* BOTÃO VOLTAR */}
                            <button onClick={() => setPastaAberta(null)} className="w-full bg-gray-800 text-white p-3 rounded-xl font-black border-4 border-black mb-2 uppercase">
                                ← VOLTAR PARA PASTAS
                            </button>
                            
                            {/* IMAGENS DENTRO DA PASTA */}
                            {grupos[pastaAberta].map((item) => (
                                <div key={item._id} className="bg-white border-4 border-black p-2 rounded-xl w-[44%] relative shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                    <PhotoView src={item.url}>
                                        <img src={item.url} className="w-full h-32 object-cover rounded-lg border-2 border-black cursor-zoom-in" alt={item.name} />
                                    </PhotoView>
                                    <button onClick={() => handleDelete(item._id)} className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full border-4 border-black active:scale-75 transition-all">
                                        <FaTrashAlt size={12} />
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        /* GALERIA PRINCIPAL */
                        Object.keys(grupos).map((nome) => {
                            const itens = grupos[nome];
                            const ehPasta = itens.length > 1;

                            return (
                                <div key={nome} onClick={() => ehPasta && setPastaAberta(nome)} className="bg-white border-4 border-black p-2 rounded-xl w-[44%] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative flex flex-col items-center">
                                    {ehPasta ? (
                                        /* VISUAL DE PASTA (Clica para abrir) */
                                        <div className="py-4 flex flex-col items-center cursor-pointer">
                                            <FaFolder size={50} className="text-yellow-500" />
                                            <p className="text-[10px] font-black mt-2 text-center px-1">{nome}</p>
                                            <span className="bg-black text-white text-[8px] px-2 rounded-full">{itens.length} ITENS</span>
                                        </div>
                                    ) : (
                                        /* IMAGEM ÚNICA (Agora com Zoom direto!) */
                                        <div className="w-full">
                                            <PhotoView src={itens[0].url}>
                                                <img src={itens[0].url} className="w-full h-32 object-cover rounded-lg border-2 border-black cursor-zoom-in" alt={nome} />
                                            </PhotoView>
                                            <p className="text-[10px] font-black mt-2 truncate w-full text-center">{nome}</p>
                                            <button 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); // Evita bugar se clicar no botão
                                                    handleDelete(itens[0]._id); 
                                                }} 
                                                className="absolute -top-3 -right-3 bg-red-600 text-white p-2 rounded-full border-4 border-black active:scale-75 transition-all"
                                            >
                                                <FaTrashAlt size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </PhotoProvider>'
            
            <ToastContainer autoClose={3000} theme="colored" />
            <Menu />
        </div>
    );
}