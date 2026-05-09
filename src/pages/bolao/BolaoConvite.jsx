import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bolaoService } from '../../services/bolaoService';
import { Logo } from '../../components/logo/Logo';

const TIPO_BOLAO = { 1: 'Placar Exato', 2: 'Vencedor (1x2)' };

export function BolaoConvite() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bolao, setBolao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    const isLogado = Boolean(localStorage.getItem('token'));

    useEffect(() => {
        bolaoService.getBolaoPublico(id)
            .then(setBolao)
            .catch(() => setErro('Bolão não encontrado ou indisponível.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleParticipar = () => {
        if (isLogado) {
            navigate(`/palpite/${id}/palpite`);
        } else {
            navigate(`/login?redirect=${encodeURIComponent(`/palpite/${id}/palpite`)}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <i className="fa-solid fa-spinner animate-spin text-primary text-4xl"></i>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-dark flex flex-col items-center justify-center gap-4 text-center p-6">
                <i className="fa-solid fa-circle-exclamation text-red-400 text-5xl"></i>
                <p className="text-white text-lg font-semibold">{erro}</p>
                <Link to="/" className="text-primary hover:underline text-sm">Ir para a página inicial</Link>
            </div>
        );
    }

    const dataPartida = new Date(bolao.dataPartida);
    const dtFechamento = new Date(bolao.dtFechamento);
    const horasParaJogo = Math.max(0, Math.floor((dataPartida - new Date()) / 3600000));
    const palpitesEncerrados = new Date() >= dtFechamento || horasParaJogo < 1;

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            <header className="p-5 border-b border-gray-800 flex items-center justify-between">
                <Logo size="md" />
                {!isLogado && (
                    <div className="flex gap-3">
                        <Link to={`/login?redirect=${encodeURIComponent(`/palpite/${id}/palpite`)}`}
                            className="text-sm text-gray-300 hover:text-white transition px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-500">
                            Entrar
                        </Link>
                        <Link to={`/register?redirect=${encodeURIComponent(`/palpite/${id}/palpite`)}`}
                            className="text-sm bg-primary text-black font-bold px-4 py-2 rounded-lg hover:bg-green-600 transition">
                            Criar conta
                        </Link>
                    </div>
                )}
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-lg">
                    <div className="bg-card border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-r from-primary/20 to-accent/10 p-6 text-center border-b border-gray-700">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Convite para Bolão</p>
                            <h1 className="text-2xl font-black text-white">{bolao.nome}</h1>
                            <p className="text-sm text-gray-400 mt-1">por {bolao.organizador}</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-around bg-dark/50 rounded-xl p-5">
                                <div className="flex flex-col items-center gap-2">
                                    <img src={bolao.flagA} alt={bolao.timeA} className="w-14 h-14 object-contain" />
                                    <span className="text-sm font-bold text-white">{bolao.timeA}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-primary font-black text-2xl italic">VS</span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {dataPartida.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        {' · '}
                                        {dataPartida.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <img src={bolao.flagB} alt={bolao.timeB} className="w-14 h-14 object-contain" />
                                    <span className="text-sm font-bold text-white">{bolao.timeB}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-dark/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Entrada</p>
                                    <p className="font-bold text-white text-lg">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bolao.valor)}
                                    </p>
                                </div>
                                <div className="bg-dark/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Participantes</p>
                                    <p className="font-bold text-white text-lg">{bolao.qtdParticipantes}</p>
                                </div>
                                <div className="bg-dark/50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Prêmio</p>
                                    <p className="font-bold text-accent text-lg">{bolao.premio}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-400 bg-dark/30 rounded-lg px-4 py-3">
                                <span><i className="fa-solid fa-gamepad mr-2"></i>{TIPO_BOLAO[bolao.tipoBolao]}</span>
                                <span>
                                    <i className="fa-regular fa-clock mr-1"></i>
                                    {palpitesEncerrados
                                        ? 'Palpites encerrados'
                                        : `${horasParaJogo}h para fechar`}
                                </span>
                            </div>

                            {palpitesEncerrados ? (
                                <div className="text-center py-3 text-gray-500 text-sm">
                                    <i className="fa-solid fa-lock mr-2"></i>
                                    As inscrições para este bolão estão encerradas.
                                </div>
                            ) : (
                                <button
                                    onClick={handleParticipar}
                                    className="w-full bg-primary hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg shadow-lg shadow-green-900/30 transition transform hover:-translate-y-0.5"
                                >
                                    {isLogado ? '⚽ Dar Meu Palpite' : '🔒 Entrar para Participar'}
                                </button>
                            )}

                            {!isLogado && !palpitesEncerrados && (
                                <p className="text-center text-xs text-gray-500">
                                    Não tem conta?{' '}
                                    <Link
                                        to={`/register?redirect=${encodeURIComponent(`/palpite/${id}/palpite`)}`}
                                        className="text-accent hover:underline font-semibold"
                                    >
                                        Cadastre-se grátis
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
