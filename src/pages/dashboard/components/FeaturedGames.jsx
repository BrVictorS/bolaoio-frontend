const STATUS_MAP = {
    Agendada: { label: 'AGENDADA', cls: 'bg-yellow-600' },
    EmAndamento: { label: '● AO VIVO', cls: 'bg-green-600 animate-pulse' },
    Encerrada: { label: 'ENCERRADA', cls: 'bg-gray-600' },
};

export function FeaturedGames({ games = [], onVerBoloes, filtroPartidaId }) {
    const latestGames = games.slice(0, 6);

    if (latestGames.length === 0) {
        return <p className="text-gray-500 text-center my-10">Nenhuma partida em destaque no momento.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {latestGames.map((game) => {
                const status = STATUS_MAP[game.statusPartida] || { label: game.statusPartida, cls: 'bg-gray-600' };
                const isAtivo = filtroPartidaId === game.id;
                const encerrada = game.statusPartida === 'Encerrada';
                const aoVivo = game.statusPartida === 'EmAndamento';

                return (
                    <div
                        key={game.id}
                        className={`bg-card rounded-xl border overflow-hidden transition group relative ${isAtivo ? 'border-primary shadow-lg shadow-primary/20' : 'border-gray-700 hover:border-primary'}`}
                    >
                        <div className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded ${status.cls}`}>
                            {status.label}
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <i className="fa-regular fa-calendar"></i>
                                {new Date(game.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                <span className="ml-auto text-xs">
                                    {new Date(game.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mb-5">
                                <div className="text-center flex-1">
                                    <img
                                        src={game.flagA}
                                        alt={game.timeA}
                                        className="w-12 h-12 mx-auto object-contain mb-2"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=?'}
                                    />
                                    <p className="font-bold text-white text-sm truncate">{game.timeA}</p>
                                </div>

                                <div className="px-4 text-center">
                                    {(encerrada || aoVivo) ? (
                                        <div className="bg-dark px-3 py-1 rounded border border-gray-700">
                                            <span className="font-mono font-bold text-xl text-white">
                                                {game.resultadoTimeA ?? 0} - {game.resultadoTimeB ?? 0}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="bg-dark px-3 py-1 rounded border border-gray-700">
                                            <span className="font-mono font-bold text-xl text-accent">VS</span>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center flex-1">
                                    <img
                                        src={game.flagB}
                                        alt={game.timeB}
                                        className="w-12 h-12 mx-auto object-contain mb-2"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=?'}
                                    />
                                    <p className="font-bold text-white text-sm truncate">{game.timeB}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => onVerBoloes(isAtivo ? null : game.id)}
                                className={`w-full py-2 rounded font-medium transition ${isAtivo ? 'bg-primary text-black' : 'bg-gray-700 hover:bg-primary text-white hover:text-black'}`}
                            >
                                {isAtivo ? (
                                    <><i className="fa-solid fa-xmark mr-2"></i>Limpar Filtro</>
                                ) : (
                                    <><i className="fa-solid fa-list mr-2"></i>Ver Bolões</>
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
