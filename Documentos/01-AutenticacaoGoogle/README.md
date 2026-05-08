# Autenticação via Google

Implementação:
- Login e cadastro através de conta Google usando Google Identity Services (GIS), envio do `id_token` ao backend e persistência do JWT retornado.

Página:
- `src/pages/login/Login.jsx`
- `src/pages/login/Register.jsx`
- `src/pages/login/CompleteProfile.jsx`

Funções:
- `googleAuth.renderButton(element, onCredential, options)` — renderiza o botão oficial do Google e dispara `onCredential` ao receber o `id_token`.
- `googleAuth.prompt(onCredential)` — chama o One Tap.
- `authService.googleLogin(idToken)` — POST `/auth/google`, salva token e flag `requerComplementoCadastro` no localStorage.
- `authService.completeProfile(cpf)` — PUT `/usuario/me/complete-profile`.
- `authService.requerComplementoCadastro()` — leitura local da flag.
- DTOs: `GoogleLoginRequestDto`, `mapGoogleLoginResponseDto`, `CompleteProfileRequestDto`, `mapCompleteProfileResponseDto` (em `src/dtos/auth`).

Sequência de renderização de componentes e execução de funções:
1. Usuário acessa `/login` ou `/register`. `AuthLayout` é renderizado.
2. `useEffect` da página chama `googleAuth.renderButton` referenciando o `div` do botão.
3. `googleAuth.js` aguarda `window.google.accounts.id`, executa `initialize` (uma única vez) e `renderButton`.
4. Usuário clica e autentica no popup do Google. GIS chama o callback registrado com `{ credential: id_token }`.
5. Página chama `authService.googleLogin(credential)` → `api.post('/auth/google', GoogleLoginRequestDto)`.
6. Resposta mapeada por `mapGoogleLoginResponseDto`. `persistSession` grava `token`, `nome`, `fotoUrl` e flag `requerComplementoCadastro`.
7. Navegação:
   - se `requerComplementoCadastro === true` → `/complete-profile`.
   - caso contrário → `/dashboard`.
8. Em `/complete-profile`, usuário envia o CPF → `authService.completeProfile(cpf)` → PUT `/usuario/me/complete-profile`. Flag é limpa e usuário segue para `/dashboard`.

Configuração:
- Variáveis em `.env` (ver `.env.example`):
  - `VITE_API_URL`
  - `VITE_GOOGLE_CLIENT_ID`
- `index.html` carrega `https://accounts.google.com/gsi/client`.
