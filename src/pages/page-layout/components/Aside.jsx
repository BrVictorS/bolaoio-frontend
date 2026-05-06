import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Adicione useEffect aqui
import { authService } from "../../../services/authService";

export function Aside({ balance }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // CORREÇÃO 1: useState na raiz, iniciando como false
    const [isAdmin, setIsAdmin] = useState(false);

    const userName = localStorage.getItem('nome') || 'Usuário';

    // CORREÇÃO 2: useEffect apenas atualiza o estado
    useEffect(() => {
        setIsAdmin(authService.isAdmin());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        navigate('/');
        window.location.reload(); 
    };

    const userActions = [
        { label: 'Meu Perfil', icon: 'fa-user', action: () => navigate('/settings') },
        { label: 'Segurança', icon: 'fa-lock', action: () => console.log('Segurança') },
        { label: 'Sair da Conta', icon: 'fa-right-from-bracket', action: handleLogout, variant: 'text-red-400' },
    ];

    return (
        <aside className="w-64 bg-card border-r border-gray-700 hidden md:flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <i className="fa-solid fa-earth-americas text-primary text-2xl"></i>
                <h1 className="text-2xl font-bold text-white tracking-tighter">Bolao<span className="text-accent">.io</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link 
                    to="/dashboard" 
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition flex items-center gap-3">
                    <i className="fa-solid fa-house w-5"></i> Painel da Copa
                </Link>

                <Link
                    to="/palpite" 
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition flex items-center gap-3">
                    <i className="fa-solid fa-ticket w-5"></i> Meus Palpites
                </Link>

                <Link 
                    to="/carteira" 
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition flex items-center gap-3">
                    <i className="fa-solid fa-wallet w-5"></i> Carteira
                </Link>
                
                <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organizador</div>
                
                <Link 
                    to="/bolao"
                    className="w-full text-left px-4 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition flex items-center gap-3">
                    <i className="fa-solid fa-users w-5"></i> Criar Bolão
                </Link>

                {/* CORREÇÃO 3: Bloco Admin Único e Correto */}
                {isAdmin && (
                    <>
                        <div className="pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Admin
                        </div>
                        <button 
                            onClick={() => navigate('/admin')} 
                            className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition flex items-center gap-3"
                        >
                            <i className="fa-solid fa-shield-halved w-5"></i> 
                            Gestão do Sistema
                        </button>
                    </>
                )}
                
            </nav>

            {/* Seção de Usuário com Menu de Funções */}
            <div className="p-4 border-t border-gray-700 relative">
                {isMenuOpen && (
                    <div className="absolute bottom-20 left-4 right-4 bg-dark border border-gray-700 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2">
                        {userActions.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-700 flex items-center gap-3 border-b border-gray-700 last:border-0 ${item.variant || 'text-gray-300'}`}
                            >
                                <i className={`fa-solid ${item.icon} w-4`}></i>
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}

                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                            <i className="fa-solid fa-user text-primary"></i>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-white truncate w-24">{userName}</p>
                            <p className="text-xs text-accent font-bold">R$ {balance.toFixed(2)}</p>
                        </div>
                    </div>
                    <i className={`fa-solid fa-chevron-up text-gray-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
                </button>
            </div>
        </aside>
    )
}