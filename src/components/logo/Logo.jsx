import LogoPng from './Logo.png';

export function Logo({ size = 'md' }) {
    const cfg = {
        sm: { h: 34, text: 'text-xl', gap: 'gap-2' },
        md: { h: 46, text: 'text-2xl', gap: 'gap-0' },
        lg: { h: 60, text: 'text-3xl', gap: 'gap-3' },
    }[size] || { h: 46, text: 'text-2xl', gap: 'gap-2.5' };

    return (
        <div className={`flex items-center ${cfg.gap}`}>
            <img src={LogoPng} alt="Bollao Logo" height={cfg.h} style={{ height: cfg.h }} />
            <span className={`${cfg.text} font-black text-white tracking-tighter leading-none`}>
                Bollao<span className="text-primary">.com</span>
            </span>
        </div>
    );
}
