export default function NotFound() {
    return (
        <div
            className={`bg-[#fefefe] w-dvw min-h-dvh flex flex-col items-center justify-center px-4 py-8 uppercase overflow-hidden absolute top-0 left-0 text-black overflow-x-hidden pb-17.5 text-center`}
        >
            <p className={`text-center w-[90%]`}>Infelizmente a Página não foi encontrada :(</p>
            <br />
            <p className={`text-center w-[90%]`}>Verifique se a URL está correta ou volte para a página inicial.</p>
            <br />
            <br />
            <div className={`w-[90%] py-2 px-4 bg-green-500 text-white rounded-md cursor-pointer font-bold text-[20px] flex text-center items-center justify-center`} onClick={() => window.location.href = "/deliveries"}>Voltar para Pagina Inicial</div>
        </div>
    )
}