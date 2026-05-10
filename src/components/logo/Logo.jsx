function BollaoIcon({ height }) {
    const w = Math.round(height * 200 / 225);
    return (
        <svg width={w} height={height} viewBox="0 0 200 225" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M58,168 C36,155 8,174 2,212 C16,204 42,193 62,200 C44,185 50,169 72,172Z" fill="#064e3b"/>
            <path d="M64,157 C40,145 10,165 4,203 C18,195 44,184 64,190 C46,176 52,160 74,163Z" fill="#059669"/>
            <path d="M50,178 C26,166 0,188 2,224 C16,216 42,205 62,211 C44,197 50,181 72,184Z" fill="#FACC15" opacity="0.75"/>
            <circle cx="108" cy="150" r="68" fill="#152238" opacity="0.5"/>
            <circle cx="108" cy="150" r="65" fill="#0d1b2e"/>
            <circle cx="108" cy="150" r="65" stroke="#1e3a5f" strokeWidth="1.5" fill="none"/>
            <polygon points="108,105 128,119 120,143 96,143 88,119" fill="white"/>
            <polygon points="128,119 148,107 162,126 155,146 136,149 120,143" fill="white"/>
            <polygon points="155,146 169,154 167,174 150,182 136,173 136,149" fill="white"/>
            <polygon points="120,143 136,173 126,193 105,196 95,178 102,158" fill="white"/>
            <polygon points="96,143 102,158 95,178 74,185 61,170 68,150" fill="white"/>
            <polygon points="88,119 68,127 54,146 62,162 68,150 96,143" fill="white"/>
            <polygon points="108,105 88,119 68,127 64,107 85,97" fill="white"/>
            <path d="M108,105L128,119M128,119L148,107M128,119L120,143M120,143L155,146M155,146L169,154M120,143L136,173M136,173L126,193M120,143L102,158M102,158L95,178M96,143L102,158M96,143L68,150M68,150L62,162M88,119L68,127M68,127L54,146M108,105L88,119M88,119L64,107" stroke="#080f1c" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M66,124 C50,116 42,105 43,94 C44,85 51,81 57,84 C63,87 63,96 59,105 C57,111 61,119 69,125Z" fill="#065f46"/>
            <circle cx="49" cy="88" r="9" fill="#0d1b2e"/>
            <circle cx="49" cy="88" r="7" fill="#152238"/>
            <circle cx="49" cy="88" r="3" fill="#059669" opacity="0.4"/>
            <path d="M150,124 C166,116 174,105 173,94 C172,85 165,81 159,84 C153,87 153,96 157,105 C159,111 155,119 147,125Z" fill="#065f46"/>
            <circle cx="167" cy="88" r="9" fill="#0d1b2e"/>
            <circle cx="167" cy="88" r="7" fill="#152238"/>
            <circle cx="167" cy="88" r="3" fill="#059669" opacity="0.4"/>
            <path d="M66,124 Q108,110 150,124 L147,144 Q108,136 69,144Z" fill="#059669"/>
            <path d="M80,124 L88,96 L96,124Z" fill="#047857"/>
            <path d="M120,124 L128,96 L136,124Z" fill="#047857"/>
            <path d="M97,120 L108,68 L119,120Z" fill="#065f46"/>
            <rect x="100" y="88" width="16" height="14" rx="3" fill="#064e3b"/>
            <rect x="101" y="89" width="14" height="12" rx="2" fill="#0f172a" opacity="0.6"/>
            <text x="108" y="99" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="bold" fontFamily="Arial,sans-serif">R$</text>
            <path d="M66,124 Q108,112 150,124" stroke="#FACC15" strokeWidth="2" fill="none" opacity="0.6"/>
            <path d="M69,144 Q108,136 147,144" stroke="#FACC15" strokeWidth="1.5" fill="none" opacity="0.35"/>
            <path d="M97,40 Q82,40 80,51 Q78,62 97,57" stroke="#FACC15" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M119,40 Q134,40 136,51 Q138,62 119,57" stroke="#FACC15" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M97,28 L97,52 Q97,65 108,67 Q119,65 119,52 L119,28Z" fill="#FACC15"/>
            <ellipse cx="108" cy="28" rx="11" ry="4.5" fill="#FACC15"/>
            <path d="M100,32 L100,52 Q100,60 107,63 Q109,61 110,56 L110,32Z" fill="white" opacity="0.18"/>
            <ellipse cx="108" cy="28" rx="11" ry="4.5" stroke="#EAB308" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <rect x="105" y="67" width="6" height="7" fill="#FACC15"/>
            <rect x="99" y="73" width="18" height="4" rx="2" fill="#FACC15"/>
            <line x1="80" y1="26" x2="80" y2="34" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            <line x1="76" y1="30" x2="84" y2="30" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            <line x1="136" y1="28" x2="136" y2="36" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
            <line x1="132" y1="32" x2="140" y2="32" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        </svg>
    );
}

export function Logo({ size = 'md' }) {
    const cfg = {
        sm: { h: 34, text: 'text-xl', gap: 'gap-2' },
        md: { h: 46, text: 'text-2xl', gap: 'gap-2.5' },
        lg: { h: 60, text: 'text-3xl', gap: 'gap-3' },
    }[size] || { h: 46, text: 'text-2xl', gap: 'gap-2.5' };

    return (
        <div className={`flex items-center ${cfg.gap}`}>
            <BollaoIcon height={cfg.h} />
            <span className={`${cfg.text} font-black text-white tracking-tighter leading-none`}>
                Bollao<span className="text-primary">.com</span>
            </span>
        </div>
    );
}
