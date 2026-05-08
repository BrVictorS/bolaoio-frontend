const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let initialized = false;
let currentCallback = null;

const waitForGsi = () => new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve(window.google.accounts.id);
    let tries = 0;
    const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
            clearInterval(timer);
            resolve(window.google.accounts.id);
        } else if (++tries > 100) {
            clearInterval(timer);
            reject(new Error("Falha ao carregar Google Identity Services"));
        }
    }, 100);
});

const ensureInitialized = async (handler) => {
    if (!GOOGLE_CLIENT_ID) {
        throw new Error("VITE_GOOGLE_CLIENT_ID não configurado.");
    }
    const gid = await waitForGsi();
    if (!initialized) {
        gid.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
                if (currentCallback) currentCallback(response);
            }
        });
        initialized = true;
    }
    currentCallback = handler;
    return gid;
};

export const googleAuth = {
    isConfigured: () => !!GOOGLE_CLIENT_ID,

    renderButton: async (element, onCredential, options = {}) => {
        const gid = await ensureInitialized(onCredential);
        gid.renderButton(element, {
            theme: options.theme || "filled_black",
            size: options.size || "large",
            width: options.width || element.offsetWidth || 320,
            text: options.text || "continue_with",
            shape: options.shape || "rectangular",
            logo_alignment: options.logo_alignment || "left"
        });
    },

    prompt: async (onCredential) => {
        const gid = await ensureInitialized(onCredential);
        gid.prompt();
    }
};
