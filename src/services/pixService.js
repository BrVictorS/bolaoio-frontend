import api from "./api";

/**
 * Serviço para gerenciar PIX e pagamentos de palpites
 *
 * Integra com endpoints do backend:
 * - POST /palpite/{id}/gerar-pix - Gera QR code PIX para um palpite
 * - GET /palpite/{id}/status-pagamento - Verifica status do pagamento
 * - GET /palpite/{id}/pix-info - Obtém informações de PIX
 */
export const pixService = {
    /**
     * Gera um QR code PIX para um palpite específico
     * @param {number} palpiteId - ID do palpite
     * @returns {Promise<Object>} Dados do PIX gerado
     *
     * Retorno esperado:
     * {
     *   success: true,
     *   palpiteId: 123,
     *   qrCode: "data:image/png;base64,...",  // Imagem base64 do QR code
     *   pixCopy: "00020126580014BR.GOV.BCB.PIX0136...",  // Código para copiar
     *   valor: 50.00,
     *   status: "pendente",
     *   expiraEm: "2024-12-16T20:00:00Z"  // Quando o PIX expira
     * }
     */
    gerarPixParaPalpite: async (palpiteId) => {
        try {
            console.log(`Gerando PIX para palpite ${palpiteId}`);

            const response = await api.get(`/bolao/palpite/gerar-pix/?id=${palpiteId}`);
            console.log("PIX gerado:", response.data);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Erro ao gerar PIX para palpite ${palpiteId}:`, error);

            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Erro ao gerar PIX';

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * Verifica o status de pagamento de um palpite
     * @param {number} palpiteId - ID do palpite
     * @returns {Promise<Object>} Status do pagamento
     *
     * Retorno esperado:
     * {
     *   palpiteId: 123,
     *   status: "pago" | "pendente" | "expirado",
     *   pagamentoEm: "2024-12-15T20:45:00Z",  // null se não pago
     *   valor: 50.00,
     *   pixId: "abc123"  // ID externo do PIX (se houver)
     * }
     */
    verificarStatusPagamento: async (palpiteId) => {
        try {
            console.log(`Verificando status de pagamento do palpite ${palpiteId}`);

            const response = await api.get(`/palpite/${palpiteId}/status-pagamento`);
            console.log("Status de pagamento:", response.data);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Erro ao verificar status ${palpiteId}:`, error);

            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Erro ao verificar status';

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * Obtém informações de PIX anteriores de um palpite
     * Útil para exibir novamente o QR code em "Meus Palpites"
     * @param {number} palpiteId - ID do palpite
     * @returns {Promise<Object>} Informações de PIX
     *
     * Retorno esperado:
     * {
     *   palpiteId: 123,
     *   qrCode: "data:image/png;base64,...",
     *   pixCopy: "00020126580014BR.GOV.BCB.PIX0136...",
     *   valor: 50.00,
     *   criadoEm: "2024-12-15T20:30:00Z",
     *   expiraEm: "2024-12-16T20:00:00Z",
     *   status: "pendente"
     * }
     */
    obterInfoPix: async (palpiteId) => {
        try {
            console.log(`Obtendo informações de PIX do palpite ${palpiteId}`);

            const response = await api.get(`/bolao/palpite/gerar-pix/?id=${palpiteId}`);
            console.log("Informações de PIX:", response.data);

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error(`Erro ao obter PIX ${palpiteId}:`, error);

            // Retornar sucesso false mas não lançar erro
            // (pode ser que não exista PIX ainda)
            return {
                success: false,
                message: 'Nenhum PIX gerado ainda'
            };
        }
    },

    /**
     * Webhook para confirmar pagamento (chamado pelo backend)
     * Não é chamado diretamente do frontend
     */
    confirmarPagamento: async (palpiteId) => {
        try {
            const response = await api.post(`/palpite/${palpiteId}/confirmar-pagamento`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao confirmar pagamento ${palpiteId}:`, error);
            throw error;
        }
    }
};
