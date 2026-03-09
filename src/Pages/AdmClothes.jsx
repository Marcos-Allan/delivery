import { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import Menu from "../Components/Menu";
import api from "../services/api";
import { ToastContainer, toast } from 'react-toastify';

export default function AdmClothes() {

    const [clothes, setClothes] = useState([])
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [preview, setPreview] = useState(null);
    const [imagem, setImagem] = useState(null);

    const CLOUD_NAME = "dgvxpeu0a"; // <-- Confira se é exatamente esse nome no Dashboard
    const UPLOAD_PRESET = "fotos_roupas"; // <-- Nome que você criou lá em Settings > Upload

    async function getCloudinaryImages() {
        setLoading(true);
        const CLOUD_NAME = "dgvxpeu0a";
        const TAG_NAME = "roupas"; // A tag que você definiu no upload

        try {
            // O Cloudinary entrega um JSON com a lista de arquivos dessa tag
            const response = await fetch(
                `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json`
            );
            
            const data = await response.json();
            
            // Salvamos o array de imagens na variável 'clothes'
            setClothes(data.resources); 
            console.log("Imagens carregadas:", data.resources);
            
        } catch (error) {
            console.error("Erro ao listar imagens:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        if (!imagem) {
            alert("POR FAVOR, SELECIONE UMA FOTO!");
            return;
        }

        setLoading(true);

        try {
            // 1. Upload para o Cloudinary
            const formData = new FormData();
            formData.append('file', imagem);
            formData.append('upload_preset', UPLOAD_PRESET); 
            // ADICIONE ESTA LINHA ABAIXO:
            formData.append('tags', 'roupas');

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            //FAZER A LÓGICA DE SALVA NO BANCO DE DADOS
            if (data.secure_url) {
                return
                // 2. Envio para o seu Back-end/n8n
                const responseApi = await api.post('/register-clothes', {
                    name: userName,
                    description: description,
                    image_url: data.secure_url 
                });

                if(responseApi.data.type === "success") {
                    alert("ROUPA CADASTRADA COM SUCESSO!");
                    setUserName("");
                    setDescription("");
                    setPreview(null);
                    setImagem(null);
                } else {
                    alert(responseApi.data.message || "ERRO AO SALVAR NO BANCO");
                }
            } else {
                alert("ERRO NO CLOUDINARY: " + (data.error?.message || "Erro desconhecido"));
            }

        } catch (error) {
            console.error('ERRO AO SALVAR:', error);
            alert("ERRO AO CONECTAR COM O SERVIDOR");
        } finally {
            setLoading(false);
        }
    };

    const notifySuccess = (msg) => {
        toast.success(msg, {
            toastId: "pedido-confirmado",
            type: "success",
            theme: 'colored'
        })
    };
        
        const notifyError = (msg) => {
        toast.error(msg, {
            toastId: "pedido-confirmado",
            type: "error",
            theme: 'colored'
        });
    }

    useEffect(() => {
        getCloudinaryImages()
    },[])

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <div
                    className={`bg-[#fefefe] w-dvw min-h-dvh flex flex-col items-center justify-start px-4 py-8 uppercase overflow-hidden absolute top-0 left-0 text-black overflow-x-hidden pb-17.5`}
                >
                    <form
                        onSubmit={handleSave}
                        className="flex flex-col items-center justify-center gap-4"
                    >
                        {/* INPUT NOME - IGUAL AO SEU NOME FUNCIONÁRIO */}
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="NOME DO CLIENTE"
                            className={`border px-3 py-2 rounded-md w-[90vw] outline-none`}
                            required
                        />

                        {/* TEXTAREA DESCRIÇÃO - ADAPTADO NO SEU ESTILO */}
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="DESCRIÇÃO DA ROUPA"
                            className={`border px-3 py-2 rounded-md w-[90vw] outline-none resize-none`}
                            rows="3"
                            required
                        />

                        {/* INPUT FOTO - USANDO O LABEL PARA ESTILIZAR NO SEU PADRÃO */}
                        <label className={`border px-3 py-2 rounded-md w-[90vw] flex flex-col items-center justify-center cursor-pointer min-h-37.5 bg-white`}>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageChange}
                                className="hidden"
                                required 
                            />
                            {preview ? (
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="max-h-35 rounded-md" 
                                />
                            ) : (
                                <span className="text-gray-400 font-bold text-center">
                                    CLIQUE PARA ADICIONAR FOTO
                                </span>
                            )}
                        </label>

                        {/* BOTÃO ADICIONAR - IGUAL AO SEU VERDE */}
                        <input
                            type="submit"
                            value="Adicionar Registro"
                            className={`bg-green-500 text-white px-4 py-2 rounded-md cursor-pointer w-[90vw] font-bold text-[20px]`}
                        />
                    </form>
                    <div className="w-[90vw] flex flex-wrap items-center justify-start gap-2 mt-4">
                        {clothes && clothes.map((item) => (
                            <div 
                                key={item.public_id} 
                                className="border-2 border-black p-2 rounded-md w-full md:w-[49%] relative bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            >
                                {/* Montando a URL da imagem com redimensionamento automático para não pesar */}
                                <img 
                                    src={`https://res.cloudinary.com/dgvxpeu0a/image/upload/c_fill,w_300,h_300/${item.public_id}.${item.format}`} 
                                    alt="Roupa"
                                    className="w-full h-40 object-cover rounded-md border border-gray-100"
                                />
                                
                                <p className="mt-2 text-[10px] font-bold">
                                    DATA: {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Menu />
                </div>
            )}
        </>
    );
}