import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

export function CompleteProfile() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login", { replace: true });
    } else if (!authService.requerComplementoCadastro()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await authService.completeProfile(cpf);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErro(err.detail || err.message || "Erro ao salvar CPF");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-md fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Falta pouco!</h2>
        <p className="text-gray-400">Para concluir seu cadastro, informe seu CPF.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">CPF</label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            className="w-full bg-card border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary focus:outline-none transition"
            placeholder="000.000.000-00"
          />
        </div>

        {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

        <button type="submit" disabled={enviando} className="w-full bg-primary hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/50 transition">
          {enviando ? "Salvando..." : "Concluir cadastro"}
        </button>
      </form>
    </div>
  );
}
