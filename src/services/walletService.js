import api from "./api";

export const walletService = {
    getBalance: async () => {
        try {
            const response = await api.get('/carteira/saldo');
            return response.data.saldo;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    deposit: async (amount) => {
        try {
            const response = await api.post('/carteira/depositar', { valor: amount });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    },

    gerarPixDeposito: async (valor) => {
        try {
            const response = await api.post('/carteira/gerar-pix-deposito', { valor });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao gerar PIX de depósito' };
        }
    },

    getPixInfo: async (transacaoId) => {
        try {
            const response = await api.get(`/carteira/pix-info?id=${transacaoId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao buscar informações do PIX' };
        }
    },

    getExtrato: async () => {
        try {
            const response = await api.get('/carteira/extrato');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    }
};
