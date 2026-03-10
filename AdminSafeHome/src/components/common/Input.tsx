import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="fg">
      {label && <label className="fl">{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text3)',
              fontSize: '13px',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </div>
        )}
        <input
          className={`fi ${className}`}
          style={icon ? { paddingLeft: '32px' } : {}}
          {...props}
        />
      </div>
      {error && (
        <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};
