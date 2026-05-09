import { FeaturedGames } from "./components/FeaturedGames"
import { OpenBoloes } from "./components/OpenBoloes"
import { bolaoService } from "../../services/bolaoService"
import { partidaService } from "../../services/partidaService"
import { useState, useEffect, useRef } from "react"

export function Dashboard() {
    const [boloes, setBoloes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [partidas, setPartidas] = useState([])
    const [filtroPartidaId, setFiltroPartidaId] = useState(null)
    const [busca, setBusca] = useState('')
    const boloesRef = useRef(null)

    useEffect(() => {
        bolaoService.getAllBoloes()
            .then(setBoloes)
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        partidaService.getAllPartidas()
            .then(setPartidas)
            .catch(console.error)
    }, [])

    const handleVerBoloes = (partidaId) => {
        setFiltroPartidaId(partidaId)
        setBusca('')
        if (partidaId) {
            setTimeout(() => {
                boloesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 50)
        }
    }

    return (
        <div id="app-content" className="flex-1 overflow-y-auto p-6 bg-dark scroll-smooth">
            <div id="view-home" className="fade-in">
                <div className="w-full bg-gradient-to-r from-green-900 to-blue-900 rounded-2xl p-6 mb-8 border border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-2">Rumo ao Hexa! 🏆</h2>
                        <p className="text-gray-200 max-w-lg">Participe dos bolões da Copa do Mundo ou crie seu bolão privado com amigos. O maior torneio do planeta começa aqui.</p>
                    </div>
                    <i className="fa-solid fa-trophy text-9xl text-white/5 absolute -bottom-4 -right-4 rotate-12"></i>
                </div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Jogos em Destaque</h2>
                        <p className="text-gray-400 text-sm">Clique em "Ver Bolões" para filtrar os bolões do jogo.</p>
                    </div>
                </div>

                <FeaturedGames
                    games={partidas}
                    onVerBoloes={handleVerBoloes}
                    filtroPartidaId={filtroPartidaId}
                />

                {isLoading ? (
                    <div className="py-10 text-center text-gray-400">
                        <i className="fa-solid fa-circle-notch animate-spin mr-2"></i>
                        Carregando bolões...
                    </div>
                ) : (
                    <OpenBoloes
                        items={boloes}
                        filtroPartidaId={filtroPartidaId}
                        busca={busca}
                        setBusca={setBusca}
                        onLimparFiltro={() => setFiltroPartidaId(null)}
                        boloesRef={boloesRef}
                    />
                )}
            </div>
        </div>
    )
}
