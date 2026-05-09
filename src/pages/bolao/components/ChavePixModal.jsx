import { useState } from 'react';
import { usuarioService } from '../../../services/usuarioService';

export default function ChavePixModal({ isOpen, onSaved }) {
    const [chavePix, setChavePix] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    if (!isOpen) return null;

    const handleSalvar = async (e) => {
        e.preventDefault();
        if (!chavePix.trim()) {
            setErro('Informe sua chave PIX.');
            return;
        }
        setLoading(true);
        setErro('');
        try {
            await usuarioService.definirChavePix(chavePix.trim());
            onSaved();
        } catch {
            setErro('Erro ao salvar chave PIX. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-card border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <i className="fa-brands fa-pix text-primary text-lg"></i>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">Cadastre sua Chave PIX</h3>
                        <p className="text-gray-400 text-xs">Necessário para criar bolões e receber pagamentos.</p>
                    </div>
                </div>

                <form onSubmit={handleSalvar} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Chave PIX</label>
                        <input
                            type="text"
                            value={chavePix}
                            onChange={(e) => setChavePix(e.target.value)}
                            placeholder="CPF, e-mail, telefone ou chave aleatória"
                            className="w-full bg-dark border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Pode ser CPF, CNPJ, e-mail, telefone (+55...) ou chave aleatória.
                        </p>
                        {erro && <p className="text-red-400 text-xs mt-1">{erro}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-primary text-black font-bold hover:bg-green-500 transition disabled:opacity-50"
                    >
                        {loading ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
                        {loading ? 'Salvando...' : 'Salvar Chave PIX'}
                    </button>
                </form>
            </div>
        </div>
    );
}
