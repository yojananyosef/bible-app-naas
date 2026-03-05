import React from 'react';

interface SurfaceProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onTouchStart?: () => void;
    dataAida?: 'attention' | 'interest' | 'desire' | 'action';
    dataCta?: 'primary' | 'secondary';
    active?: boolean;
    elevation?: boolean;
}

export const Surface: React.FC<SurfaceProps> = ({
    children,
    className = "",
    onClick,
    onDoubleClick,
    onTouchStart,
    dataAida,
    dataCta,
    active,
    elevation = true
}) => {
    const isPrimary = dataCta === 'primary';

    return (
        <div
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onTouchStart={onTouchStart}
            data-aida={dataAida}
            data-cta={dataCta}
            className={`
                border-2 border-[#0A0A0A] 
                transition-all duration-150 ease-out
                ${isPrimary ? 'bg-[#FFD600]' : active ? 'bg-gray-100' : className.includes('bg-') ? '' : 'bg-white'}
                ${(onClick || onDoubleClick || onTouchStart) ? `cursor-pointer ${elevation ? 'hover:-translate-y-0.5 shadow-[3px_3px_0_#0A0A0A]' : 'hover:bg-gray-50'} active:translate-y-0 active:shadow-none` : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

export const Avatar: React.FC<{ letter: string; color?: string; size?: 'sm' | 'md' | 'lg'; borderColor?: string }> = ({
    letter,
    color = "bg-[#FFD600]",
    size = "md",
    borderColor = "border-[#0A0A0A]"
}) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-base",
        lg: "w-20 h-20 text-2xl"
    };

    return (
        <div className={`${sizeClasses[size]} rounded-full border-2 ${borderColor} shadow-[2px_2px_0_#0A0A0A] ${color} flex items-center justify-center font-black shrink-0`}>
            {letter}
        </div>
    );
};
