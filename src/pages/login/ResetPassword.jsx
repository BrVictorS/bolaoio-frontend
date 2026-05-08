import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setMensagem("");

    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    setEnviando(true);
    try {
      const res = await authService.resetPasswordWithToken(token, novaSenha);
      setMensagem(res.mensagem || "Senha redefinida com sucesso.");
      setTimeout(() => navigate("/login", { replace: true }), 1800);
    } catch (err) {
      setErro(err.detail || err.message || "Não foi possível redefinir a senha.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-md fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Redefinir senha</h2>
        <p className="text-gray-400">Crie uma nova senha para sua conta.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!tokenFromUrl && (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5 ml-1">Token recebido por e-mail</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full bg-card border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="Cole aqui o token"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">Nova senha</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              minLength={6}
              required
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">Confirmar nova senha</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i className="fa-solid fa-check-double"></i>
            </span>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              minLength={6}
              required
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="Repita a senha"
            />
          </div>
        </div>

        {mensagem && <p className="text-sm text-green-400 text-center">{mensagem}</p>}
        {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

        <button type="submit" disabled={enviando} className="w-full bg-primary hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/50 transition">
          {enviando ? "Redefinindo..." : "Redefinir senha"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        <Link to="/login" className="text-accent hover:text-yellow-300 font-bold hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
