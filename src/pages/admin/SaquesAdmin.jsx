import { useState, useEffect } from 'react';
import { saqueAdminService } from '../../services/saqueService';

export function SaquesAdmin() {
    const [saques, setSaques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [processando, setProcessando] = useState(null);
    const [modalRejeicao, setModalRejeicao] = useState(null);
    const [motivoRejeicao, setMotivoRejeicao] = useState('');

    useEffect(() => {
        carregarPendentes();
    }, []);

    const carregarPendentes = async () => {
        try {
            setLoading(true);
            setErro('');
            const data = await saqueAdminService.listarPendentes();
            setSaques(data.solicitacoes || []);
        } catch (err) {
            setErro(err?.erro || 'Erro ao carregar solicitações.');
        } finally {
            setLoading(false);
        }
    };

    const handleAprovar = async (id) => {
        if (!window.confirm('Confirma a aprovação deste saque?')) return;

        try {
            setProcessando(id);
            await saqueAdminService.aprovarSaque(id);
            setSaques(saques.filter(s => s.id !== id));
        } catch (err) {
            alert(err?.erro || 'Erro ao aprovar saque.');
        } finally {
            setProcessando(null);
        }
    };

    const handleRejeitar = async (id) => {
        if (!motivoRejeicao.trim()) {
            alert('Informe o motivo da rejeição.');
            return;
        }

        try {
            setProcessando(id);
            await saqueAdminService.rejeitarSaque(id, motivoRejeicao);
            setSaques(saques.filter(s => s.id !== id));
            setModalRejeicao(null);
            setMotivoRejeicao('');
        } catch (err) {
            alert(err?.erro || 'Erro ao rejeitar saque.');
        } finally {
            setProcessando(null);
        }
    };

    const tipoChavePixLabel = (tipo) => {
        const labels = {
            'Cpf': 'CPF',
            'Email': 'E-mail',
            'Telefone': 'Telefone',
            'Aleatoria': 'Chave Aleatória'
        };
        return labels[tipo] || tipo;
    };

    const formatarCpf = (cpf) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const ocultarChavePix = (tipo, chave) => {
        if (!chave) return '';
        if (tipo === 'Cpf') return formatarCpf(chave);
        if (tipo === 'Email') return chave.replace(/(.{2})(.*)(@.*)/, '$1***$3');
        if (tipo === 'Telefone') return chave.replace(/(\d{2})(\d+)(\d{4})/, '($1) ****-$3');
        return '***' + chave.slice(-4);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Solicitações de Saques</h1>
                <p className="text-gray-400">Gerencie as solicitações de saque pendentes dos usuários.</p>
            </div>

            {erro && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6 text-red-300 flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    {erro}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <i className="fa-solid fa-spinner animate-spin text-4xl text-gray-500"></i>
                    <p className="text-gray-400 mt-4">Carregando solicitações...</p>
                </div>
            ) : saques.length === 0 ? (
                <div className="bg-card border border-gray-700 rounded-lg p-12 text-center">
                    <i className="fa-solid fa-check-circle text-4xl text-green-500 mb-4"></i>
                    <p className="text-gray-400">Nenhuma solicitação pendente no momento.</p>
                </div>
            ) : (
                <div className="bg-card border border-gray-700 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-dark border-b border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Usuário</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Valor</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Chave PIX</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tipo</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Data</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {saques.map((saque) => (
                                    <tr key={saque.id} className="hover:bg-dark/50 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{saque.usuarioNome}</p>
                                                <p className="text-xs text-gray-500">{saque.usuarioEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-bold">
                                                R$ {saque.valor.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300 font-mono text-sm">
                                                {ocultarChavePix(saque.tipoChavePix, saque.chavePix)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300 text-sm">
                                                {tipoChavePixLabel(saque.tipoChavePix)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(saque.dataSolicitacao).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAprovar(saque.id)}
                                                    disabled={processando === saque.id}
                                                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1"
                                                >
                                                    {processando === saque.id ? (
                                                        <><i className="fa-solid fa-spinner animate-spin"></i></>
                                                    ) : (
                                                        <><i className="fa-solid fa-check"></i> Aprovar</>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setModalRejeicao(saque.id)}
                                                    disabled={processando === saque.id}
                                                    className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1"
                                                >
                                                    <i className="fa-solid fa-times"></i> Rejeitar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Rejeição */}
            {modalRejeicao && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-card border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Rejeitar Saque</h3>
                        <p className="text-gray-400 mb-4">Informe o motivo da rejeição:</p>
                        <textarea
                            value={motivoRejeicao}
                            onChange={(e) => setMotivoRejeicao(e.target.value)}
                            placeholder="Ex: Dados da chave PIX incorretos..."
                            className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-3 text-white text-sm focus:border-primary outline-none mb-4 resize-none"
                            rows="4"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setModalRejeicao(null);
                                    setMotivoRejeicao('');
                                }}
                                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 rounded font-bold transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleRejeitar(modalRejeicao)}
                                disabled={processando === modalRejeicao || !motivoRejeicao.trim()}
                                className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white py-2 rounded font-bold transition"
                            >
                                Rejeitar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
