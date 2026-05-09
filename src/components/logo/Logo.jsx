import logoImg from '../../assets/logo.png';

export function Logo({ size = 'md' }) {
    const cfg = {
        sm: { h: 32, text: 'text-xl', gap: 'gap-2' },
        md: { h: 44, text: 'text-2xl', gap: 'gap-2.5' },
        lg: { h: 58, text: 'text-3xl', gap: 'gap-3' },
    }[size] || { h: 44, text: 'text-2xl', gap: 'gap-2.5' };

    return (
        <div className={`flex items-center ${cfg.gap}`}>
            <img src={logoImg} alt="Bolao.io" style={{ height: cfg.h, width: 'auto' }} />
            <span className={`${cfg.text} font-black text-white tracking-tighter leading-none`}>
                Bolao<span className="text-primary">.io</span>
            </span>
        </div>
    );
}
