import api from "./api";

export const saqueService = {
    /**
     * Solicita um saque
     * @param {number} valor - Valor a sacar
     * @param {string} tipoChavePix - Tipo: "Cpf", "Email", "Telefone", "Aleatoria"
     * @param {string} chavePix - Chave PIX (CPF, email, telefone, etc)
     */
    solicitarSaque: async (valor, tipoChavePix, chavePix) => {
        try {
            const response = await api.post('/saques/solicitar', {
                valor,
                tipoChavePix,
                chavePix
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao solicitar saque' };
        }
    },

    /**
     * Lista as solicitações do usuário
     * @param {string} status - Filtro opcional: "Pendente", "Pago", "Rejeitado"
     */
    minhasSolicitacoes: async (status = null) => {
        try {
            const params = status ? `?status=${status}` : '';
            const response = await api.get(`/saques/minhas-solicitacoes${params}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao buscar solicitações' };
        }
    },

    /**
     * Obtém detalhes de uma solicitação
     * @param {string} id - ID da solicitação
     */
    obterSolicitacao: async (id) => {
        try {
            const response = await api.get(`/saques/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao obter solicitação' };
        }
    }
};

// Serviço para admin
export const saqueAdminService = {
    /**
     * Lista todas as solicitações pendentes
     */
    listarPendentes: async () => {
        try {
            const response = await api.get('/admin/saques/pendentes');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao listar solicitações pendentes' };
        }
    },

    /**
     * Aprova uma solicitação de saque
     * @param {string} id - ID da solicitação
     */
    aprovarSaque: async (id) => {
        try {
            const response = await api.put(`/admin/saques/${id}/aprovar`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao aprovar saque' };
        }
    },

    /**
     * Rejeita uma solicitação de saque
     * @param {string} id - ID da solicitação
     * @param {string} motivo - Motivo da rejeição
     */
    rejeitarSaque: async (id, motivo) => {
        try {
            const response = await api.put(`/admin/saques/${id}/rejeitar`, { motivo });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao rejeitar saque' };
        }
    }
};
