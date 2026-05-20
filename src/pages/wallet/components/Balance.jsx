import { ModalDeposit } from "./ModalDeposit"
import { useState } from "react";

export function Balance({ balance, loading = false, onDeposit }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="bg-gradient-to-br from-green-800 to-dark border border-green-700 rounded-xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-green-200 text-sm font-medium">Saldo Disponível</p>
                    {loading ? (
                        <div className="mt-2 mb-1">
                            <i className="fa-solid fa-spinner animate-spin text-white text-2xl"></i>
                        </div>
                    ) : (
                        <h2 className="text-4xl font-bold text-white mt-2 font-mono">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                        </h2>
                    )}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setOpen(true)}
                            className="flex-1 bg-white text-green-800 hover:bg-gray-200 py-2 rounded font-bold transition flex items-center justify-center gap-2">
                            <i className="fa-solid fa-plus text-sm"></i>
                            Depositar
                        </button>
                        <button
                            className="flex-1 bg-black/30 hover:bg-black/50 py-2 rounded text-white font-medium border border-white/10 transition flex items-center justify-center gap-2 cursor-not-allowed opacity-60">
                            <i className="fa-solid fa-arrow-up text-sm"></i>
                            Sacar
                        </button>
                    </div>
                </div>
                <i className="fa-solid fa-wallet text-9xl text-white/5 absolute -bottom-8 -right-8 -rotate-12"></i>
            </div>

            <ModalDeposit
                isOpen={open}
                onClose={() => setOpen(false)}
                onSuccess={onDeposit}
            />
        </>
    );
}
