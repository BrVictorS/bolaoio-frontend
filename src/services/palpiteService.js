import api from "./api";

export const palpiteService = {
    /**
     * Registra um novo palpite no bolão
     * @param {Object} palpiteData - Dados do palpite
     * @param {number} palpiteData.BolaoId - ID do bolão
     * @param {number} palpiteData.golsTimeA - Gols do time A (se placar exato)
     * @param {number} palpiteData.golsTimeB - Gols do time B (se placar exato)
     * @param {string} palpiteData.vencedor - Vencedor ('A', 'E', 'B' se vencedor 1x2)
     * @returns {Promise<Object>} Resultado da operação
     */
    postPalpite: async (palpiteData) => {
        try {
            console.log(`Enviando palpite:`, palpiteData);

            // Validar dados básicos
            if (!palpiteData.BolaoId) {
                return {
                    success: false,
                    message: 'ID do bolão inválido'
                };
            }

            const response = await api.post(`/bolao/registrar_palpite`, palpiteData);
            console.log("Resposta do servidor:", response.data);

            return {
                success: true,
                message: response.data?.message || 'Palpite registrado com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.error("Erro ao enviar palpite:", error);

            // Tratar diferentes tipos de erro
            let errorMessage = 'Erro ao conectar com o servidor';

            if (error.response?.data) {
                // Erro do servidor
                errorMessage = error.response.data.detail ||
                    error.response.data.message ||
                    error.response.data ||
                    errorMessage;
            } else if (error.message) {
                // Erro de rede ou outro
                errorMessage = error.message;
            }

            // Tratar mensagens específicas
            if (errorMessage.includes('prazo')) {
                errorMessage = 'O prazo para este bolão foi encerrado';
            } else if (errorMessage.includes('máximo')) {
                errorMessage = 'O bolão atingiu o número máximo de participantes';
            } else if (errorMessage.includes('already')) {
                errorMessage = 'Você já tem um palpite registrado neste bolão';
            }

            console.log("Mensagem de erro detalhada:", errorMessage);

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * Obtém todos os palpites do usuário logado
     * @returns {Promise<Array>} Lista de palpites
     */
    getPalpiteByUser: async () => {
        try {
            const response = await api.get(`/bolao/listar_palpites_por_usuario`);
            console.log("Palpites recuperados:", response.data);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar palpites:", error);

            // Retornar array vazio em caso de erro
            if (error.response?.status === 404) {
                return [];
            }

            throw error;
        }
    },

    /**
     * Obtém um palpite específico pelo ID
     * @param {number} palpiteId - ID do palpite
     * @returns {Promise<Object>} Dados do palpite
     */
    getPalpiteById: async (palpiteId) => {
        try {
            const response = await api.get(`/bolao/palpite/${palpiteId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar palpite ${palpiteId}:`, error);
            throw error;
        }
    },

    /**
     * Atualiza um palpite existente
     * @param {number} palpiteId - ID do palpite
     * @param {Object} palpiteData - Novos dados do palpite
     * @returns {Promise<Object>} Resultado da operação
     */
    updatePalpite: async (palpiteId, palpiteData) => {
        try {
            console.log(`Atualizando palpite ${palpiteId}:`, palpiteData);

            const response = await api.put(`/bolao/palpite/${palpiteId}`, palpiteData);
            console.log("Palpite atualizado:", response.data);

            return {
                success: true,
                message: response.data?.message || 'Palpite atualizado com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.error(`Erro ao atualizar palpite ${palpiteId}:`, error);

            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Erro ao atualizar palpite';

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * Deleta um palpite
     * @param {number} palpiteId - ID do palpite
     * @returns {Promise<Object>} Resultado da operação
     */
    deletePalpite: async (palpiteId) => {
        try {
            console.log(`Deletando palpite ${palpiteId}`);

            const response = await api.delete(`/bolao/palpite/${palpiteId}`);

            return {
                success: true,
                message: response.data?.message || 'Palpite removido com sucesso!',
                data: response.data
            };
        } catch (error) {
            console.error(`Erro ao deletar palpite ${palpiteId}:`, error);

            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                'Erro ao remover palpite';

            return {
                success: false,
                message: errorMessage
            };
        }
    },

    /**
     * Valida se é possível fazer um palpite em um bolão
     * @param {number} bolaoId - ID do bolão
     * @returns {Promise<Object>} Resultado da validação
     */
    validarPalpite: async (bolaoId) => {
        try {
            const response = await api.get(`/bolao/${bolaoId}/validar-palpite`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao validar palpite para bolão ${bolaoId}:`, error);
            throw error;
        }
    }
};
