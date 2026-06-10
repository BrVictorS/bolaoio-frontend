import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="bg-dark text-gray-200 font-sans h-screen w-full flex overflow-hidden">

        {/* <div className="hidden lg:flex lg:w-1/2 relative bg-stadium items-center justify-center">
            <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm"></div>

            <div className="relative z-10 text-center px-12">
                <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur border border-white/20 text-accent text-5xl shadow-2xl">
                    <image src="../../components/logo/Logo.png" alt="Bollao Logo" className="w-12 h-12" />
                </div>
                <h1 className="text-5xl font-bold text-white tracking-tighter mb-4">Bollao<span className="text-primary">.com</span></h1>
                <p className="text-xl text-gray-200 font-light">A emoção da Copa do Mundo começa no seu palpite. Junte-se a milhares de torcedores.</p>
                
                <div className="mt-12 flex gap-4 justify-center text-white/50">
                    <i className="fa-brands fa-instagram hover:text-white transition cursor-pointer text-xl"></i>
                    <i className="fa-brands fa-twitter hover:text-white transition cursor-pointer text-xl"></i>
                    <i className="fa-brands fa-tiktok hover:text-white transition cursor-pointer text-xl"></i>
                </div>
            </div>
        </div> */}

        {/* Conteúdo da rota */}
        <div className="w-full flex justify-center items-center p-8 w-full flex justify-center items-center p-8 bg-gradient-to-r from-green-900 to-blue-900  relativerelative">
            <Outlet />
        </div>
        </div>
    )
}
   