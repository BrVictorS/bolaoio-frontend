import React, { useEffect } from 'react';

export default function ToastNotification({ type, message }) {
    // Determinar cores baseado no tipo
    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-500/20',
                    border: 'border-green-500/40',
                    icon: 'fa-check-circle',
                    text: 'text-green-400',
                    barColor: 'bg-green-500'
                };
            case 'error':
                return {
                    bg: 'bg-red-500/20',
                    border: 'border-red-500/40',
                    icon: 'fa-exclamation-circle',
                    text: 'text-red-400',
                    barColor: 'bg-red-500'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-500/20',
                    border: 'border-yellow-500/40',
                    icon: 'fa-exclamation-triangle',
                    text: 'text-yellow-400',
                    barColor: 'bg-yellow-500'
                };
            case 'info':
            default:
                return {
                    bg: 'bg-blue-500/20',
                    border: 'border-blue-500/40',
                    icon: 'fa-info-circle',
                    text: 'text-blue-400',
                    barColor: 'bg-blue-500'
                };
        }
    };

    const styles = getStyles();

    return (
        <div className={`fixed top-6 right-6 max-w-md ${styles.bg} border ${styles.border} rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-right-6 duration-300 z-50`}>
            {/* Barra de progresso */}
            <div className={`absolute bottom-0 left-0 h-1 ${styles.barColor} rounded-b-2xl animate-shrink`} style={{
                animation: 'shrink 4s linear forwards'
            }}></div>

            {/* Conteúdo */}
            <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 text-2xl ${styles.text} mt-0.5`}>
                    <i className={`fa-solid ${styles.icon}`}></i>
                </div>
                <div className="flex-1">
                    <p className={`font-bold text-sm ${styles.text}`}>
                        {type === 'success' && 'Sucesso!'}
                        {type === 'error' && 'Erro!'}
                        {type === 'warning' && 'Aviso!'}
                        {type === 'info' && 'Informação'}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">{message}</p>
                </div>
                <button className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition`}>
                    <i className="fa-solid fa-times text-lg"></i>
                </button>
            </div>

            {/* Estilo de animação */}
            <style>{`
                @keyframes shrink {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }
            `}</style>
        </div>
    );
}
