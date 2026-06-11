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

export function PoliticaDePrivacidade() {
    return (
        <div className="min-h-screen bg-dark flex flex-col font-sans">
            <Navbar />

            <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-12">
                <div className="mb-10">
                    <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">
                        Legal
                    </span>
                    <h1 className="text-3xl font-black text-white mb-2">Política de Privacidade</h1>
                    <p className="text-gray-500 text-sm">Última atualização: junho de 2026 · Em conformidade com a LGPD (Lei nº 13.709/2018)</p>
                </div>

                <div className="bg-card border border-gray-700 rounded-2xl p-6 md:p-8">

                    <Section title="1. Controlador dos Dados">
                        <p>
                            A <strong className="text-white">Bollao.com</strong> é a controladora dos dados pessoais coletados
                            nesta plataforma, responsável por definir como e por que os dados são tratados, nos termos
                            da Lei Geral de Proteção de Dados (LGPD).
                        </p>
                        <p>
                            Para exercer seus direitos ou esclarecer dúvidas, entre em contato pelo canal de suporte
                            disponível na plataforma.
                        </p>
                    </Section>

                    <Section title="2. Dados Coletados">
                        <p>Coletamos os seguintes dados pessoais:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-gray-300">Dados de cadastro:</strong> nome completo, CPF, e-mail e senha (armazenada de forma criptografada);</li>
                            <li><strong className="text-gray-300">Dados financeiros:</strong> histórico de transações, depósitos e saques realizados via PIX;</li>
                            <li><strong className="text-gray-300">Dados de uso:</strong> bolões criados, palpites registrados, horários de acesso;</li>
                            <li><strong className="text-gray-300">Dados técnicos:</strong> endereço IP, tipo de dispositivo, navegador e sistema operacional;</li>
                            <li><strong className="text-gray-300">Dados de autenticação Google</strong> (quando o login é realizado via Google): e-mail e foto de perfil públicos.</li>
                        </ul>
                    </Section>

                    <Section title="3. Finalidade do Tratamento">
                        <p>Os dados coletados são utilizados para:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Criar e gerenciar a conta do Usuário;</li>
                            <li>Processar depósitos, saques e prêmios via PIX;</li>
                            <li>Verificar a identidade e prevenir fraudes (inclusive cumprimento de obrigações legais, como prevenção à lavagem de dinheiro);</li>
                            <li>Enviar comunicações sobre a conta, bolões e atualizações da plataforma;</li>
                            <li>Melhorar a experiência do usuário e o desempenho da plataforma;</li>
                            <li>Cumprir obrigações legais e regulatórias.</li>
                        </ul>
                    </Section>

                    <Section title="4. Base Legal">
                        <p>O tratamento dos dados pessoais é fundamentado nas seguintes bases legais da LGPD:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-gray-300">Execução de contrato</strong> (art. 7º, V) — para prestação dos serviços contratados;</li>
                            <li><strong className="text-gray-300">Consentimento</strong> (art. 7º, I) — para comunicações de marketing e cookies não essenciais;</li>
                            <li><strong className="text-gray-300">Obrigação legal</strong> (art. 7º, II) — para cumprimento de normas regulatórias e fiscais;</li>
                            <li><strong className="text-gray-300">Legítimo interesse</strong> (art. 7º, IX) — para prevenção a fraudes e segurança da plataforma.</li>
                        </ul>
                    </Section>

                    <Section title="5. Compartilhamento de Dados">
                        <p>Seus dados podem ser compartilhados com:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-gray-300">Mercado Pago:</strong> para processamento de pagamentos PIX, conforme a política de privacidade deles;</li>
                            <li><strong className="text-gray-300">Google:</strong> quando o login é realizado via Google OAuth;</li>
                            <li><strong className="text-gray-300">Autoridades competentes:</strong> quando exigido por lei, ordem judicial ou regulamentação aplicável.</li>
                        </ul>
                        <p>
                            Não vendemos, alugamos ou cedemos seus dados pessoais a terceiros para fins comerciais.
                        </p>
                    </Section>

                    <Section title="6. Retenção dos Dados">
                        <p>
                            Os dados são mantidos pelo período necessário para a prestação dos serviços e cumprimento
                            de obrigações legais. Dados financeiros são retidos por <strong className="text-white">5 anos</strong> após
                            o encerramento da conta, conforme exigência fiscal e regulatória.
                        </p>
                        <p>
                            Após o prazo de retenção, os dados são anonimizados ou excluídos de forma segura.
                        </p>
                    </Section>

                    <Section title="7. Segurança dos Dados">
                        <p>
                            Adotamos medidas técnicas e administrativas adequadas para proteger seus dados contra acesso
                            não autorizado, vazamento, alteração ou destruição, incluindo:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Criptografia de senhas com hash seguro;</li>
                            <li>Autenticação via tokens JWT com expiração;</li>
                            <li>Comunicação via HTTPS;</li>
                            <li>Validação de assinatura HMAC-SHA256 em notificações de pagamento.</li>
                        </ul>
                        <p>
                            Em caso de incidente de segurança que possa afetar seus dados, você será notificado
                            conforme exigido pela LGPD.
                        </p>
                    </Section>

                    <Section title="8. Seus Direitos (LGPD)">
                        <p>Como titular dos dados, você tem direito a:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong className="text-gray-300">Confirmação e acesso:</strong> saber quais dados temos sobre você;</li>
                            <li><strong className="text-gray-300">Correção:</strong> solicitar atualização de dados incompletos ou incorretos;</li>
                            <li><strong className="text-gray-300">Anonimização ou exclusão:</strong> para dados tratados com base no consentimento;</li>
                            <li><strong className="text-gray-300">Portabilidade:</strong> receber seus dados em formato estruturado;</li>
                            <li><strong className="text-gray-300">Revogação do consentimento:</strong> a qualquer momento, sem prejuízo à legalidade dos tratamentos anteriores;</li>
                            <li><strong className="text-gray-300">Oposição:</strong> opor-se ao tratamento em casos de descumprimento da LGPD.</li>
                        </ul>
                        <p>
                            Para exercer qualquer um desses direitos, entre em contato pelo e-mail{' '}
                            <a href="mailto:bollao.com@gmail.com" className="text-primary hover:underline">bollao.com@gmail.com</a>.
                            Atenderemos sua solicitação em até <strong className="text-white">15 dias úteis</strong>.
                        </p>
                    </Section>

                    <Section title="9. Cookies e Tecnologias Similares">
                        <p>
                            Utilizamos cookies e armazenamento local (<em>localStorage</em>) exclusivamente para manter
                            sua sessão autenticada e preservar preferências de interface. Não utilizamos cookies de
                            rastreamento ou publicidade de terceiros.
                        </p>
                    </Section>

                    <Section title="10. Menores de Idade">
                        <p>
                            A plataforma é destinada exclusivamente a maiores de 18 anos. Não coletamos conscientemente
                            dados de menores. Se identificarmos um cadastro de menor de idade, a conta será imediatamente
                            encerrada e os dados excluídos.
                        </p>
                    </Section>

                    <Section title="11. Alterações nesta Política">
                        <p>
                            Esta Política pode ser atualizada periodicamente. Alterações significativas serão comunicadas
                            por e-mail ou notificação na plataforma com antecedência mínima de 15 dias. O uso continuado
                            após a comunicação representa aceite da política revisada.
                        </p>
                    </Section>

                    <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <p className="text-gray-500 text-xs">
                            Autoridade Nacional de Proteção de Dados (ANPD): <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">gov.br/anpd</a>
                        </p>
                        <Link
                            to="/termos-de-uso"
                            className="text-primary text-sm hover:underline font-medium"
                        >
                            Ver Termos de Uso →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
