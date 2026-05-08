import { Logo } from '../logo/Logo';

export function Footer() {
  return (
    <footer className="bg-card border-t border-gray-800 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="mb-4">
            <Logo size="sm" />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            A maior plataforma de palpites para a Copa de 2026. Desafie seus amigos e prove que você entende de futebol.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li><a href="#" className="hover:text-primary">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-primary">Privacidade</a></li>
            <li><a href="#" className="hover:text-primary">Suporte</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Siga o Hexa</h4>
          <div className="flex gap-4 text-gray-400">
            <i className="fa-brands fa-instagram hover:text-accent cursor-pointer text-xl transition"></i>
            <i className="fa-brands fa-twitter hover:text-accent cursor-pointer text-xl transition"></i>
            <i className="fa-brands fa-tiktok hover:text-accent cursor-pointer text-xl transition"></i>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs border-t border-gray-800 pt-6">
        &copy; 2026 Bollao.com - Todos os direitos reservados.
      </div>
    </footer>
  );
}
