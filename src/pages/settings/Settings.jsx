import { useState, useEffect } from 'react';
import { usuarioService } from '../../services/usuarioService';

const TIPOS_CHAVE_PIX = [
    { value: 0, label: 'CPF' },
    { value: 1, label: 'E-mail' },
    { value: 2, label: 'Telefone' },
    { value: 3, label: 'Chave aleatória' },
];

function Toast({ msg, tipo, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3500);
        return () => clearTimeout(t);
    }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
            ${tipo === 'erro' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
            {msg}
        </div>
    );
}

function SecaoPerfil({ perfil, onSalvo }) {
    const [nome, setNome] = useState(perfil?.nome || '');
    const [email, setEmail] = useState(perfil?.email || '');
    const [salvando, setSalvando] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (perfil) { setNome(perfil.nome); setEmail(perfil.email); }
    }, [perfil]);

    const salvar = async () => {
        if (!nome.trim() || !email.trim()) { setToast({ msg: 'Preencha todos os campos', tipo: 'erro' }); return; }
        setSalvando(true);
        try {
            await usuarioService.alterarPerfil(nome.trim(), email.trim());
            localStorage.setItem('nome', nome.trim());
            setToast({ msg: 'Perfil atualizado com sucesso!', tipo: 'ok' });
            onSalvo?.();
        } catch (e) {
            setToast({ msg: e?.response?.data?.detail || 'Erro ao atualizar perfil', tipo: 'erro' });
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="bg-card border border-gray-700 rounded-2xl p-6">
            {toast && <Toast msg={toast.msg} tipo={toast.tipo} onClose={() => setToast(null)} />}
            <h2 className="text-white font-bold mb-1">Dados pessoais</h2>
            <p className="text-gray-500 text-sm mb-5">Nome e e-mail exibidos no sistema.</p>
            <div className="space-y-4">
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">Nome</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary outline-none transition" />
                </div>
                <div>
                    <label className="text-gray-400 text-sm mb-1 block">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full bg-dark border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:border-primary outline-none transition" />
                </div>
                {perfil?.cpf && (
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">CPF</label>
                        <input type="text" value={perfil.cpf} disabled className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-500 text-sm cursor-not-allowed" />
                    </div>
                )}
                <button
                    onClick={salvar}
                    disabled={salvando}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-green-600 text-black text-sm font-bold transition disabled:opacity-60">
                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
        </div>
    );
}

function SecaoChavePix() {
    return (
        <div className="bg-card border border-gray-700 rounded-2xl p-6">
            <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-blue-400 mt-0.5"></i>
                <div>
                    <h2 className="text-white font-bold mb-1">Chave PIX</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        A chave PIX não é mais cadastrada antecipadamente. Ao ganhar um bolão, acesse <strong className="text-white">Meus Palpites</strong> e clique em <strong className="text-yellow-400">Resgatar Prêmio</strong> para informar sua chave no momento do resgate.
                    </p>
                </div>
            </div>
        </div>
    );
}

export function Settings() {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    const carregar = async () => {
        try {
            const data = await usuarioService.getMe();
            setPerfil(data);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { carregar(); }, []);

    if (loading) {
        return (
            <div className="flex-1 p-6 flex items-center justify-center">
                <i className="fa-solid fa-spinner animate-spin text-primary text-2xl"></i>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-white">Configurações</h1>
                <p className="text-gray-400 text-sm mt-1">Gerencie seus dados e preferências de pagamento.</p>
            </div>
            <div className="space-y-5">
                <SecaoPerfil perfil={perfil} onSalvo={carregar} />
                <SecaoChavePix perfil={perfil} />
            </div>
        </div>
    );
}
