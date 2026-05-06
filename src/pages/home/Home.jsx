import { Navbar } from '../../components/navbar/Navbar.jsx';
import { Footer } from '../../components/footer/Footer.jsx';
import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="min-h-screen bg-dark flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center relative z-10 fade-in">
            <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-bold mb-6 uppercase tracking-widest">
              Copa do Mundo 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
              SEU PALPITE VALE <span className="text-accent italic">OURO!</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Crie grupos privados, acompanhe o ranking em tempo real e dispute prêmios com a galera.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition transform hover:-translate-y-1 shadow-xl shadow-green-900/40">
                Começar agora
              </Link>
              <Link to="/regras" className="w-full sm:w-auto bg-card hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg border border-gray-700 transition">
                Ver regras
              </Link>
            </div>
          </div>

          {/* Elementos decorativos de fundo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-0"></div>
        </section>

        {/* Estatísticas / Destaques */}
        <section className="py-16 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "fa-users", label: "Jogadores Ativos", val: "+150k" },
              { icon: "fa-shield-halved", label: "Grupos Criados", val: "12.430" },
              { icon: "fa-circle-dollar-to-slot", label: "Prêmios em Jogo", val: "R$ 50k" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-gray-800 text-center hover:border-primary/50 transition">
                <i className={`fa-solid ${item.icon} text-primary text-3xl mb-4`}></i>
                <h3 className="text-3xl font-bold text-white mb-1">{item.val}</h3>
                <p className="text-gray-500 text-sm uppercase font-bold tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
