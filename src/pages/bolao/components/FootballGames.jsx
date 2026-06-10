import React, { useState } from 'react';

export function FootballGames({ games, onSelect, selectedGameId }) {
    const [searchTerm, setSearchTerm] = useState('');

    
    const filteredGames = games.filter(game => {
            const matchesStatus = game.statusPartida === 'Agendada';
            const matchesSearch =
                game.timeA.toLowerCase().includes(searchTerm.toLowerCase()) ||
                game.timeB.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesStatus && matchesSearch;
        }
    );

    const getFlagUrl = (team) => {
        const isoCode = team.id.substring(0, 2).toUpperCase();
        return `https://flagsapi.com/${isoCode}/flat/64.png`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {/* Cabeçalho e Busca */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-700 pb-4">
                <h3 className="text-primary font-bold text-sm uppercase tracking-wider flex items-center">
                    <i className="fa-solid fa-futbol mr-2"></i> 
                    Selecione a Partida
                </h3>
                
                <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        <i className="fa-solid fa-magnifying-glass text-xs"></i>
                    </span>
                    <input 
                        type="text"
                        placeholder="Buscar seleção..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-dark border border-gray-600 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-primary outline-none transition"
                    />
                </div>
            </div>

            {/* Lista de Jogos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredGames.length > 0 ? (
                    filteredGames.map((game) => (
                        <div 
                            key={game.id}
                            onClick={() => onSelect(game)}
                            className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer group flex flex-col justify-between ${
                                selectedGameId === game.id 
                                ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
                                : 'border-gray-700 bg-dark/40 hover:border-gray-500'
                            }`}
                        >
                            {/* Info Superior  */}
                            <div className="flex justify-between items-center mb-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    game.statusPartida === 'Agendada' ? 'bg-blue-500/10 text-blue-400' : 'bg-primary/10 text-primary'
                                }`}>
                                    {game.statusPartida}
                                </span>
                            </div>

                            {/* Confronto */}
                            <div className="flex items-center justify-between">
                                {/* Mandante */}
                                <div className="flex flex-col items-center flex-1">
                                    <div className="w-14 h-10 mb-2 overflow-hidden rounded shadow-sm border border-gray-800">
                                        <img 
                                            src={game.flagA} 
                                            alt={game.timeA}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = getFlagUrl(game.timeA); 
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-center">{game.timeA}</span>
                                </div>

                                <div className="px-4">
                                    <span className="text-lg font-black italic text-gray-700">VS</span>
                                </div>

                                {/* Visitante */}
                                <div className="flex flex-col items-center flex-1">
                                    <div className="w-14 h-10 mb-2 overflow-hidden rounded shadow-sm border border-gray-800">
                                        <img 
                                            src={game.flagB} 
                                            alt={game.timeB}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            onError={(e) => { 
                                                e.target.onerror = null; 
                                                e.target.src = getFlagUrl(game.timeB); 
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-center">{game.timeB}</span>
                                </div>
                            </div>

                            {/* Info Inferior */}
                            <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between items-center text-[10px] text-gray-400">
                                <span className="font-mono">{formatDate(game.data)}</span>
                            </div>

                            {/* Indicador de Seleção */}
                            {selectedGameId === game.id && (
                                <div className="absolute -top-2 -right-2 bg-primary text-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-card">
                                    <i className="fa-solid fa-check text-[10px]"></i>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-10 text-center text-gray-500">
                        Nenhuma partida encontrada.
                    </div>
                )}
            </div>
        </div>
    );
}