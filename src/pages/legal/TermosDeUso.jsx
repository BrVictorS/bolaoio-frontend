import { Link } from 'react-router-dom';
import { Navbar } from '../../components/navbar/Navbar.jsx';
import { Footer } from '../../components/footer/Footer.jsx';

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full inline-block"></span>
            {title}
        </h2>
        <div className="text-gray-400 text-sm leading-relaxed space-y-2">{children}</div>
    </div>
);

export function TermosDeUso() {
    return (
        <div className="min-h-screen bg-dark flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12">
                <div className="mb-10">
                    <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                        Legal
                    </span>
                    <h1 className="text-3xl font-black text-white mb-2">Termos de Uso</h1>
                    <p className="text-gray-500 text-sm">Última atualização: junho de 2026</p>
                </div>

                <div className="bg-card border border-gray-700 rounded-2xl p-6 md:p-8">

                    <Section title="1. Aceitação dos Termos">
                        <p>
                            Ao acessar ou utilizar a plataforma <strong className="text-white">Bollao.com</strong>, você declara ter lido,
                            compreendido e concordado integralmente com estes Termos de Uso. Caso não concorde com qualquer
                            disposição, você não deve utilizar a plataforma.
                        </p>
                        <p>
                            Estes termos constituem um contrato vinculante entre você ("Usuário") e a Bollao.com ("Plataforma").
                        </p>
                    </Section>

                    <Section title="2. Descrição do Serviço">
                        <p>
                            A Bollao.com é uma plataforma de bolões esportivos na qual usuários podem criar e participar de
                            grupos de palpites em partidas de futebol, incluindo a Copa do Mundo 2026. A plataforma possibilita:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Criação de bolões públicos ou privados;</li>
                            <li>Registro de palpites em partidas disponíveis;</li>
                            <li>Gestão de carteira virtual para depósitos e resgates via PIX;</li>
                            <li>Distribuição de prêmios entre os acertadores.</li>
                        </ul>
                    </Section>

                    <Section title="3. Elegibilidade">
                        <p>
                            O uso da plataforma é permitido exclusivamente a pessoas físicas com <strong className="text-white">18 anos ou mais</strong>,
                            residentes no Brasil, com CPF válido e capacidade civil plena.
                        </p>
                        <p>
                            Ao se cadastrar, o Usuário declara que atende a todos os requisitos acima e que as informações
                            fornecidas são verdadeiras e atualizadas.
                        </p>
                    </Section>

                    <Section title="4. Cadastro e Conta">
                        <p>
                            O Usuário é responsável pela veracidade dos dados informados no cadastro, incluindo nome completo,
                            CPF, e-mail e senha. O compartilhamento de credenciais de acesso é expressamente proibido.
                        </p>
                        <p>
                            A Plataforma reserva-se o direito de suspender ou encerrar contas com indícios de fraude,
                            duplicidade ou violação destes termos.
                        </p>
                    </Section>

                    <Section title="5. Carteira Virtual e Movimentações Financeiras">
                        <p>
                            Os valores depositados na carteira virtual da Bollao.com são utilizados exclusivamente para
                            participação nos bolões. Depósitos e saques são realizados via <strong className="text-white">PIX</strong>,
                            processados pelo Mercado Pago.
                        </p>
                        <p>
                            Sobre cada transação incidem taxas administrativas e de processamento informadas no momento
                            da operação. A Plataforma não é responsável por atrasos ou falhas de processamento causados
                            por terceiros (instituições financeiras, Mercado Pago etc.).
                        </p>
                        <p>
                            Saques estão sujeitos à verificação de identidade e podem ser retidos em caso de suspeita
                            de atividade irregular.
                        </p>
                    </Section>

                    <Section title="6. Regras dos Bolões">
                        <p>
                            Cada bolão possui regras próprias definidas pelo seu criador (tipo de palpite, valor de entrada,
                            data limite e distribuição de prêmio). O Usuário deve verificar as regras antes de participar.
                        </p>
                        <p>
                            O resultado das partidas é obtido de fontes oficiais. Em caso de divergência, a Plataforma adotará
                            o placar oficial da entidade organizadora da competição.
                        </p>
                        <p>
                            Palpites registrados não podem ser alterados ou cancelados após confirmação.
                        </p>
                    </Section>

                    <Section title="7. Distribuição de Prêmios">
                        <p>
                            Os prêmios são calculados com base no total arrecadado no bolão, descontadas as taxas da
                            plataforma. O pagamento é creditado automaticamente na carteira virtual do vencedor após a
                            conclusão e validação do resultado.
                        </p>
                        <p>
                            Em caso de empate nos palpites, o prêmio é dividido proporcionalmente ao número de cotas
                            vencedoras.
                        </p>
                    </Section>

                    <Section title="8. Conduta do Usuário">
                        <p>É vedado ao Usuário:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Utilizar a plataforma para fins ilícitos ou fraudulentos;</li>
                            <li>Manipular resultados ou criar múltiplas contas;</li>
                            <li>Tentar acessar áreas restritas da plataforma;</li>
                            <li>Publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros.</li>
                        </ul>
                        <p>
                            O descumprimento pode resultar em suspensão imediata da conta e retenção dos saldos
                            pendentes para apuração.
                        </p>
                    </Section>

                    <Section title="9. Limitação de Responsabilidade">
                        <p>
                            A Bollao.com não garante disponibilidade ininterrupta do serviço e não se responsabiliza
                            por perdas decorrentes de falhas técnicas, interrupções ou eventos fora de seu controle
                            (caso fortuito ou força maior).
                        </p>
                        <p>
                            A participação nos bolões é de natureza recreativa. A Plataforma não garante lucros e
                            alerta que o Usuário pode perder o valor investido nas cotas.
                        </p>
                    </Section>

                    <Section title="10. Propriedade Intelectual">
                        <p>
                            Todo o conteúdo da plataforma (marca, layout, código, textos e imagens) é de propriedade
                            exclusiva da Bollao.com ou de seus licenciantes. É proibida a reprodução ou uso comercial
                            sem autorização prévia por escrito.
                        </p>
                    </Section>

                    <Section title="11. Alterações nos Termos">
                        <p>
                            A Bollao.com pode atualizar estes Termos a qualquer momento. Alterações relevantes serão
                            comunicadas por e-mail ou notificação na plataforma. O uso continuado após a comunicação
                            representa aceite das novas condições.
                        </p>
                    </Section>

                    <Section title="12. Lei Aplicável e Foro">
                        <p>
                            Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de
                            domicílio do Usuário para dirimir eventuais conflitos, salvo disposição legal em contrário.
                        </p>
                    </Section>

                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <p className="text-gray-500 text-xs">
                            Dúvidas? Entre em contato pelo suporte da plataforma.
                        </p>
                        <Link
                            to="/politica-de-privacidade"
                            className="text-primary text-sm hover:underline font-medium"
                        >
                            Ver Política de Privacidade →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
