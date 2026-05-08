import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { authService } from "../../services/authService";
import { googleAuth } from "../../services/googleAuth";

export function Login() {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate(authService.requerComplementoCadastro() ? "/complete-profile" : "/dashboard", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!googleAuth.isConfigured()) {
      setGoogleError("Login com Google não configurado.");
      return;
    }
    if (!googleBtnRef.current) return;

    const handleCredential = async (response) => {
      try {
        const dto = await authService.googleLogin(response.credential);
        navigate(dto.requerComplementoCadastro ? "/complete-profile" : "/dashboard", { replace: true });
      } catch (err) {
        setGoogleError(err.detail || err.message || "Falha ao autenticar com Google");
      }
    };

    googleAuth.renderButton(googleBtnRef.current, handleCredential).catch((err) => {
      setGoogleError(err.message);
    });
  }, [navigate]);

  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      await authService.login(formData.email, formData.senha);
      navigate(authService.requerComplementoCadastro() ? "/complete-profile" : "/dashboard");
    } catch (error) {
      setErro(error.detail || error.message || "E-mail ou senha inválidos");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Link
        to="/"
        className="absolute top-6 left-6 text-gray-500 hover:text-white transition lg:hidden"
      >
        <i className="fa-solid fa-arrow-left"></i> Voltar
      </Link>

      <div id="view-login" className="w-full max-w-md fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
          <p className="text-gray-400">Insira suas credenciais para acessar seus bolões.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div ref={googleBtnRef} className="w-full flex justify-center"></div>
            {googleError && <p className="text-xs text-red-400 text-center">{googleError}</p>}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OU CONTINUE COM EMAIL</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5 ml-1">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm text-gray-400">Senha</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-green-400 transition">Esqueceu a senha?</Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <i className="fa-solid fa-lock"></i>
                </span>
                <input
                  type="password"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

          <button type="submit" disabled={enviando} className="w-full bg-primary hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/50 transition transform hover:-translate-y-0.5">
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Não tem uma conta?
          <Link to="/register" className="text-accent hover:text-yellow-300 font-bold ml-1 hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </>
  );
}
