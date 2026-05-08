# Recuperação de senha

Implementação:
- Fluxo "esqueci minha senha" baseado em token enviado por e-mail. O usuário solicita o e-mail, recebe um link com `?token=...` e define a nova senha em uma página dedicada.

Página:
- `src/pages/login/ForgotPassword.jsx` — solicitação do link.
- `src/pages/login/ResetPassword.jsx` — confirmação da nova senha (lê `?token=` da URL).
- `src/pages/login/Login.jsx` — link "Esqueceu a senha?" leva a `/forgot-password`.

Funções:
- `authService.forgotPassword(email)` — POST `/auth/forgot-password`. Retorna sempre mensagem genérica.
- `authService.resetPasswordWithToken(token, novaSenha)` — POST `/auth/reset-password-token`.
- DTOs: `ForgotPasswordRequestDto`, `mapForgotPasswordResponseDto`, `ResetPasswordWithTokenRequestDto`, `mapResetPasswordWithTokenResponseDto` (em `src/dtos/auth`).

Sequência de renderização de componentes e execução de funções:
1. Usuário em `/login` clica em "Esqueceu a senha?" → router monta `ForgotPassword` dentro de `AuthLayout`.
2. Usuário envia o e-mail → `handleSubmit` chama `authService.forgotPassword(email)`.
3. `api.post('/auth/forgot-password', ForgotPasswordRequestDto)` → resposta mapeada e exibida em `mensagem`.
4. Usuário recebe e-mail com link `${VITE_FRONT}/reset-password?token=xxx`.
5. Ao acessar `/reset-password`, `ResetPassword` lê `useSearchParams().get("token")` e preenche o estado `token`.
6. Usuário define nova senha → `handleSubmit` chama `authService.resetPasswordWithToken(token, novaSenha)`.
7. `api.post('/auth/reset-password-token', ResetPasswordWithTokenRequestDto)` → ao sucesso, `setMensagem` e `setTimeout` redireciona a `/login`.
