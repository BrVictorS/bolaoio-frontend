import { Balance } from "./components/Balance"
import { DailyLimit } from "./components/DailyLimit"
import { TransactionHistory } from "./components/TransactionHistory"
import { walletService } from '../../services/walletService';
import { useEffect, useState } from "react";

export function Wallet() {
    const [balance, setBalance] = useState(0);
    const [extrato, setExtrato] = useState([]);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [loadingExtrato, setLoadingExtrato] = useState(true);

    const fetchData = async () => {
        try {
            setLoadingBalance(true);
            const bal = await walletService.getBalance();
            setBalance(bal);
        } catch (error) {
            console.error("Erro ao obter saldo:", error);
        } finally {
            setLoadingBalance(false);
        }

        try {
            setLoadingExtrato(true);
            const ext = await walletService.getExtrato();
            setExtrato(ext);
        } catch (error) {
            console.error("Erro ao obter extrato:", error);
        } finally {
            setLoadingExtrato(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex-1 p-4 md:p-6 bg-dark min-h-screen">
            {/* Cabeçalho */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <i className="fa-solid fa-wallet text-primary"></i>
                    Minha Carteira
                </h1>
                <p className="text-gray-500 text-sm mt-1">Gerencie seu saldo e visualize seu histórico de transações</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna esquerda */}
                <div className="lg:col-span-1 space-y-6">
                    <Balance balance={balance} loading={loadingBalance} onDeposit={fetchData} />
                    
                </div>

                {/* Coluna direita — histórico */}
                <TransactionHistory extrato={extrato} loading={loadingExtrato} />
            </div>
        </div>
    );
}
