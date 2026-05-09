import { BolaoCard } from "./BolaoCard"

export function OpenBoloes({ items = [], filtroPartidaId, busca, setBusca, onLimparFiltro, boloesRef }) {
    const normalizar = (str) => str?.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') ?? '';

    const buscaNorm = normalizar(busca);

    const filtrados = items.filter((b) => {
        const matchPartida = !filtroPartidaId || b.partidaId === filtroPartidaId;
        const matchBusca = !buscaNorm ||
            normalizar(b.timeA).includes(buscaNorm) ||
            normalizar(b.timeB).includes(buscaNorm) ||
            normalizar(b.nome).includes(buscaNorm);
        return matchPartida && matchBusca;
    });

    return (
        <div ref={boloesRef}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Bolões Abertos</h2>
                    <p className="text-gray-400 text-sm">
                        {filtroPartidaId
                            ? <span className="text-primary font-medium">Filtrando por jogo selecionado</span>
                            : 'Bolões públicos disponíveis.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar seleção..."
                            className="w-full bg-card border border-gray-700 text-white text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-primary placeholder-gray-500"
                        />
                        {busca && (
                            <button
                                onClick={() => setBusca('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                            >
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        )}
                    </div>

                    {filtroPartidaId && (
                        <button
                            onClick={onLimparFiltro}
                            className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-2 rounded-lg transition whitespace-nowrap"
                        >
                            <i className="fa-solid fa-filter-circle-xmark mr-1"></i>Limpar jogo
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4 pb-10">
                {filtrados.length > 0 ? (
                    filtrados.map((bolao) => (
                        <BolaoCard key={bolao.id} bolao={bolao} />
                    ))
                ) : (
                    <div className="bg-card border border-gray-700 rounded-xl p-8 text-center">
                        <i className="fa-solid fa-magnifying-glass text-gray-600 text-3xl mb-3 block"></i>
                        <p className="text-gray-500">
                            {filtroPartidaId || busca
                                ? 'Nenhum bolão encontrado para esse filtro.'
                                : 'Nenhum bolão encontrado no momento.'}
                        </p>
                        {(filtroPartidaId || busca) && (
                            <button
                                onClick={() => { onLimparFiltro(); setBusca(''); }}
                                className="mt-3 text-sm text-primary hover:underline"
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
