import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { authService } from '../../services/authService';
import { googleAuth } from '../../services/googleAuth';

export function Register() {
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const [googleError, setGoogleError] = useState("");

  useEffect(() => {
    if (!googleAuth.isConfigured()) {
      setGoogleError("");
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

    googleAuth.renderButton(googleBtnRef.current, handleCredential, { text: "signup_with" }).catch((err) => {
      setGoogleError(err.message);
    });
  }, [navigate]);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '',
    confirmarSenha: ''
  });

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErro("");

    if (formData.senha !== formData.confirmarSenha) {
      setErro("As senhas não coincidem!");
      return;
    }

    setEnviando(true);
    try {
      await authService.register(formData.nome, formData.email, formData.senha, formData.cpf);
      navigate('/login');
    } catch (error) {
      setErro(error.detail || error.message || "Erro ao criar conta");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full max-w-md fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Crie sua Conta</h2>
        <p className="text-gray-400">Prepare-se para o hexa. É rápido e fácil.</p>
      </div>

      <div className="space-y-3 mb-6">
        <div ref={googleBtnRef} className="w-full flex justify-center"></div>
        {googleError && <p className="text-xs text-red-400 text-center">{googleError}</p>}
      </div>

      <div className="relative flex items-center mb-6">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OU CADASTRE-SE COM E-MAIL</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full bg-card border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary focus:outline-none transition"
            placeholder="João"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full bg-card border border-gray-700 rounded-lg py-3 px-4 text-white focus:border-primary focus:outline-none transition"
            placeholder="000.000.000-00"
            required
          />
        </div>

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
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">Senha</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i className="fa-solid fa-lock"></i>
            </span>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5 ml-1">Confirmar Senha</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i className="fa-solid fa-check-double"></i>
            </span>
            <input
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="w-full bg-card border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-primary focus:outline-none transition"
              placeholder="Repita a senha"
              minLength={6}
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mt-2">
          <input type="checkbox" id="terms" className="mt-1 accent-primary w-4 h-4 cursor-pointer" required />
          <label htmlFor="terms" className="text-xs text-gray-400 cursor-pointer">
            Eu concordo com os <a href="#" className="text-primary hover:underline">Termos de Uso</a> e <a href="#" className="text-primary hover:underline">Política de Privacidade</a> do Bollao.com.
          </label>
        </div>

        {erro && <p className="text-sm text-red-400 text-center">{erro}</p>}

        <button type="submit" disabled={enviando} className="w-full bg-primary hover:bg-green-600 disabled:opacity-60 text-white py-3 rounded-lg font-bold text-lg shadow-lg shadow-green-900/50 transition transform hover:-translate-y-0.5 mt-2">
          {enviando ? "Criando..." : "Criar Conta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-400">
        Já tem cadastro?
        <Link to="/login" className="text-accent hover:text-yellow-300 font-bold ml-1 hover:underline">
          Fazer Login
        </Link>
      </p>
    </div>
  );
}
