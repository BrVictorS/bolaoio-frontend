export default function MercadoPagoTokenModal({ isOpen, redirectUrl }) {
    if (!isOpen) return null;

    const handleConectar = () => {
        window.location.href = redirectUrl;
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-gray-700 rounded-3xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in duration-300">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                        <i className="fa-solid fa-link text-blue-400 text-2xl"></i>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-2">
                    Conecte sua conta Mercado Pago
                </h2>
                <p className="text-gray-400 text-center text-sm mb-8">
                    Para criar bolões e receber pagamentos dos participantes, você precisa autorizar o acesso à sua conta Mercado Pago.
                </p>

                <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
                        <p className="text-gray-300 text-sm">Clique em <strong className="text-white">Conectar ao Mercado Pago</strong> abaixo.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
                        <p className="text-gray-300 text-sm">Faça login na sua conta Mercado Pago e autorize o acesso.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
                        <p className="text-gray-300 text-sm">Você será redirecionado de volta e poderá criar seu bolão normalmente.</p>
                    </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex gap-3 mb-6">
                    <i className="fa-solid fa-shield-halved text-yellow-400 flex-shrink-0 mt-0.5"></i>
                    <p className="text-yellow-300 text-xs">
                        A conexão é segura e seus dados bancários nunca são compartilhados. O acesso é usado exclusivamente para processar pagamentos dos seus bolões.
                    </p>
                </div>

                <button
                    onClick={handleConectar}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-primary hover:bg-green-600 text-black transform hover:-translate-y-0.5 transition-all shadow-lg shadow-green-900/30"
                >
                    <i className="fa-solid fa-arrow-right-to-bracket mr-2"></i>
                    Conectar ao Mercado Pago
                </button>
            </div>
        </div>
    );
}
