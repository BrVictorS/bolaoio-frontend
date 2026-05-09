import { Link } from 'react-router-dom';

export function BolaoCard({ bolao }) {
    const {
        id, nome, valor, dtFechamento, qtdParticipantes,
        organizador, partida = {}
    } = bolao || {};

    const nomeUsuario = localStorage.getItem('nome');
    const isOrganizador = nomeUsuario && organizador && nomeUsuario === organizador;

    const hoje = new Date();
    const fechamento = new Date(dtFechamento);
    const diasParaFechamento = Math.ceil((fechamento - hoje) / (1000 * 60 * 60 * 24));

    return (
        <div className="bg-card border border-gray-700 rounded-xl p-4 hover:border-primary transition group relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-1/4">
                <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 shrink-0">
                    <span className="text-2xl">⚽</span>
                </div>
                <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition">{nome}</h4>
                    {partida.timeA && (
                        <span className="text-xs text-gray-400">{partida.timeA} vs {partida.timeB}</span>
                    )}
                    {isOrganizador && (
                        <span className="text-xs text-accent font-semibold block">
                            <i className="fa-solid fa-star mr-1"></i>Organizador
                        </span>
                    )}
                </div>
            </div>

            <div className="w-full md:w-1/4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Participantes</span>
                    <span className="text-white">{qtdParticipantes}</span>
                </div>
                <div className="text-xs text-blue-400 font-medium">
                    Ilimitado <i className="fa-solid fa-infinity ml-1"></i>
                </div>
            </div>

            <div className="flex justify-between md:block w-full md:w-auto text-right md:text-center min-w-[120px]">
                <div>
                    <p className="text-xs text-gray-400">Entrada</p>
                    <p className="font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm font-medium ${diasParaFechamento <= 2 ? 'text-red-400' : 'text-yellow-500'}`}>
                        <i className="fa-regular fa-clock"></i>
                        {diasParaFechamento > 0 ? `${diasParaFechamento}d restantes` : 'Fechado'}
                    </div>
                </div>
                <Link
                    to={`/palpite/${id}/palpite`}
                    className="bg-gray-700 hover:bg-primary text-white px-6 py-2 rounded-lg font-medium transition whitespace-nowrap">
                    Entrar
                </Link>
            </div>
        </div>
    );
}
