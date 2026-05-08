export const LoginRequestDto = (email, senha) => ({ Email: email, Senha: senha });
export const mapLoginResponseDto = (data) => ({ token: data?.token, nome: data?.nome, email: data?.email });

export const RegisterRequestDto = (nome, email, senha, cpf) => ({ Nome: nome, Email: email, Senha: senha, Cpf: cpf });
export const mapRegisterResponseDto = (data) => ({ id: data?.id, nome: data?.nome, email: data?.email });

export const GoogleLoginRequestDto = (idToken) => ({ IdToken: idToken });
export const mapGoogleLoginResponseDto = (data) => ({
    token: data?.token,
    nome: data?.nome,
    email: data?.email,
    fotoUrl: data?.fotoUrl ?? null,
    requerComplementoCadastro: !!data?.requerComplementoCadastro
});

export const ForgotPasswordRequestDto = (email) => ({ Email: email });
export const mapForgotPasswordResponseDto = (data) => ({ mensagem: data?.mensagem });

export const ResetPasswordWithTokenRequestDto = (token, novaSenha) => ({ Token: token, NovaSenha: novaSenha });
export const mapResetPasswordWithTokenResponseDto = (data) => ({ mensagem: data?.mensagem });

export const CompleteProfileRequestDto = (cpf) => ({ Cpf: cpf });
export const mapCompleteProfileResponseDto = (data) => ({ id: data?.id, nome: data?.nome, email: data?.email, cpf: data?.cpf });
