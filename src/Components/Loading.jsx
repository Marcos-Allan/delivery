import loadingImage from '../assets/loading.gif'

export default function Loading() {
    return(
        <div
            style={{
            backgroundImage: `url(${loadingImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
            }}
            className="z-3 w-screen h-screen flex flex-col items-center justify-center"
        >
            <div className={`w-screen h-screen flex flex-col justify-center items-center absolute top-0 left-0 bg-white opacity-[0.7]`}>
            <div className={`flex items-center justify-center gap-3`}>
                <p className={`text-[224px] text-[#a591ef] animate-bounce [animation-delay:0.3s]`}>.</p>
                <p className={`text-[224px] text-[#a591ef] animate-bounce [animation-delay:0.15s]`}>.</p>
                <p className={`text-[224px] text-[#a591ef] animate-bounce`}>.</p>
            </div>
            </div>

        </div>
    )
}