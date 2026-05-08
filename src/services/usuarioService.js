import api from "./api";

export const usuarioService = {
    verificarMercadoPago: async () => {
        try {
            const response = await api.get('/usuario/verificar-mercado-pago');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Erro ao conectar com o servidor' };
        }
    }
};
