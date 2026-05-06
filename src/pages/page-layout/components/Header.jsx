import { ModalDeposit} from "../../wallet/components/ModalDeposit";
import { useState } from "react";

export function Header({ balance }) {
    const [open, setOpen] = useState(false);
    
    return (
        <>
            <header className="h-16 bg-card border-b border-gray-700 flex items-center justify-between px-6">
                <div className="md:hidden">
                    <i className="fa-solid fa-bars text-xl"></i>
                </div>
            
                <div className="relative w-96 hidden md:block">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <i className="fa-solid fa-search"></i>
                    </span>
                    <input 
                        type="text" 
                        className="w-full bg-dark text-sm rounded-full pl-10 pr-4 py-2 border border-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Buscar seleções (Brasil, França, Argentina)..." />
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-300 border border-gray-600">
                        <i className="fa-regular fa-clock text-accent mr-1"></i> Próximo jogo: 15min
                    </div>
                    <button className="relative p-2 hover:bg-gray-700 rounded-full transition">
                        <i className="fa-regular fa-bell text-gray-300"></i>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                  
                </div>
            </header>
        </>
    );
}