import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Return from "../Components/Return";
import { FaTrashAlt, FaCloudUploadAlt } from "react-icons/fa";
import md5 from "md5"; // Certifique-se de ter rodado: npm install md5

export default function AdmClothes() {
    const [clothes, setClothes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [imagem, setImagem] = useState(null);

    // DADOS REAIS DO SEU ARQUIVO
    const CLOUD_NAME = "dgvxpeu0a";
    const API_KEY = "388439499831778"; 
    const API_SECRET = "Z98DkX7_S6-N8H9oKkXz8L-S8pI"; 
    const UPLOAD_PRESET = "fotos_roupas";
    const TAG_NAME = "roupas";

    // 1. BUSCAR IMAGENS NA NUVEM
    async function getCloudinaryImages() {
        setLoading(true);
        try {
            // O Cloudinary requer que a opção "Resource List" esteja DESMARCADA nas configurações de Upload
            const response = await fetch(
                `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json?${new Date().getTime()}`
            );
            
            if (response.ok) {
                const data = await response.json();
                setClothes(data.resources);
            } else {
                console.error("Erro ao listar: Verifique as permissões de 'Resource List' no Cloudinary.");
            }
        } catch (error) {
            console.error("Erro de conexão com Cloudinary:", error);
        } finally {
            setLoading(false);
        }
    }

    // 2. EXCLUIR IMAGEM (ASSINATURA GERADA NO FRONT-END)
    const handleDelete = async (public_id) => {
        if (!window.confirm("VOCÊ TEM CERTEZA QUE DESEJA APAGAR ESTA FOTO?")) return;

        setLoading(true);
        try {
            const timestamp = Math.round((new Date()).getTime() / 1000);
            
            // Gerando a assinatura MD5 necessária para deleção segura
            const signature = md5(`public_id=${public_id}&timestamp=${timestamp}${API_SECRET}`);

            const formData = new FormData();
            formData.append("public_id", public_id);
            formData.append("signature", signature);
            formData.append("timestamp", timestamp);
            formData.append("api_key", API_KEY);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
                { method: "POST", body: formData }
            );

            const data = await response.json();

            if (data.result === "ok") {
                toast.success("FOTO EXCLUÍDA COM SUCESSO!");
                // Filtra o estado local para sumir na hora da tela
                setClothes(prev => prev.filter(item => item.public_id !== public_id));
            } else {
                toast.error("ERRO: " + data.result);
            }
        } catch (error) {
            toast.error("ERRO AO SE CONECTAR COM A NUVEM");
        } finally {
            setLoading(false);
        }
    };

    // 3. UPLOAD DE NOVA FOTO
    const handleSave = async (e) => {
        e.preventDefault();
        if (!imagem) return toast.error("SELECIONE UMA FOTO ANTES!");

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', imagem);
            formData.append('upload_preset', UPLOAD_PRESET);
            formData.append('tags', TAG_NAME); // Define a tag para ela aparecer na listagem

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );

            const data = await response.json();

            if (data.secure_url) {
                toast.success("UPLOAD CONCLUÍDO!");
                setPreview(null);
                setImagem(null);
                // Aguarda 1 segundo para a indexação da tag e atualiza a galeria
                setTimeout(() => getCloudinaryImages(), 1000);
            }
        } catch (error) {
            toast.error("ERRO NO UPLOAD");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        getCloudinaryImages();
    }, []);

    return (
        <div className="bg-[#F6F6FA] min-h-dvh pb-24 uppercase overflow-x-hidden absolute top-0 left-0 w-full font-sans">
            {loading && <Loading />}
            <Return />
            
            <form onSubmit={handleSave} className="flex flex-col items-center gap-4 pt-10 px-4">
                <h1 className="font-black text-lg text-black mb-2 tracking-tighter">Gerenciador de Galeria</h1>
                
                <label className="border-4 border-black p-4 rounded-xl w-full max-w-md flex flex-col items-center bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-y-1 transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    {preview ? (
                        <img src={preview} className="max-h-44 rounded-lg border-2 border-black" alt="Preview" />
                    ) : (
                        <div className="flex flex-col items-center py-8 text-gray-500">
                            <FaCloudUploadAlt size={50} className="text-black" />
                            <span className="font-black text-[12px] mt-3">CLIQUE PARA ADICIONAR FOTO</span>
                        </div>
                    )}
                </label>

                <button type="submit" className="bg-green-600 text-white w-full max-w-md py-4 rounded-xl font-black text-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase">
                    Salvar na Nuvem
                </button>
            </form>

            {/* LISTAGEM DAS FOTOS */}
            <div className="flex flex-wrap gap-4 px-4 mt-16 justify-center">
                {clothes.length > 0 ? clothes.map((item) => (
                    <div key={item.public_id} className="bg-white border-4 border-black p-2 rounded-xl w-[44%] md:w-[22%] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative transition-all">
                        <img 
                            src={`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_500,h_500,c_fill/${item.public_id}.${item.format}`} 
                            className="w-full h-36 object-cover rounded-lg border-2 border-black" 
                            alt="Roupa"
                        />
                        
                        <button 
                            onClick={() => handleDelete(item.public_id)}
                            className="absolute -top-3 -right-3 bg-red-600 text-white p-2.5 rounded-full border-4 border-black shadow-lg hover:bg-red-700 active:scale-75 transition-all"
                        >
                            <FaTrashAlt size={14} />
                        </button>
                        <div className="mt-2 text-center">
                            <p className="text-[7px] font-black text-gray-400">ID: {item.public_id.split('/').pop()}</p>
                        </div>
                    </div>
                )) : (
                    <div className="mt-10 text-center flex flex-col items-center opacity-30">
                         <p className="text-[12px] font-black">Nenhuma foto na galeria.</p>
                    </div>
                )}
            </div>
            
            <Menu />
            <ToastContainer theme="colored" position="top-center" />
        </div>
    );
}