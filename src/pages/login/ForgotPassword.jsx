import { Link } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setMensagem("");
    setEnviando(true);
    try {
      const res = await authService.forgotPassword(email);
      setMensagem(res.mensagem || "Se houver uma conta para esse e-mail, enviaremos as instruções de redefinição.");
    } catch (err) {
      setErro(err.detail || err.message || "Erro ao solicitar redefinição");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-md fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Esqueceu a senha?</h2>
        <p className="text-gray-400">Informe seu e-mail e enviaremos um link para redefinir.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">E-mail</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i className="fa-regular fa-envelope"></i>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        {mensagem && <p className="text-sm text-green-400 text-center">{mensagem}</p>}
        {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

        <button type="submit" disabled={enviando} className="w-full bg-primary hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/50 transition">
          {enviando ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Lembrou a senha?
        <Link to="/login" className="text-accent hover:text-yellow-300 font-bold ml-1 hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
