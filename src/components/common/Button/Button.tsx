import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit';
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    onClick,
    className = '',
    style = {}
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            style={{ cursor: 'pointer', ...style }}
            className={`
                w-full h-12 px-6
                bg-red-500 hover:bg-red-600 
                text-white font-medium
                rounded-lg
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-red-400
                ${className}
            `}
        >
            {children}
        </button>
    );
};

export default Button;