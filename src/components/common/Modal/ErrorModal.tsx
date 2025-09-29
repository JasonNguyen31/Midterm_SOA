import React from 'react';
import type { ErrorModalProps } from '../../../types/auth.types';
import { UI_CONSTANTS } from '../../../utils/constants';


const ErrorModal: React.FC<ErrorModalProps> = ({
    isOpen,
    onClose,
    title,
    okButtonText
}) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}>
                {/* Error message */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px'
                }}>
                    <p style={{
                        color: '#374151',
                        fontSize: '16px',
                        margin: 0,
                        lineHeight: '1.5'
                    }}>
                        {title}
                    </p>
                </div>

                {/* OK Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: UI_CONSTANTS.COLORS.PRIMARY,
                            color: UI_CONSTANTS.COLORS.GRAY_LIGHT,
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 24px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {okButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;