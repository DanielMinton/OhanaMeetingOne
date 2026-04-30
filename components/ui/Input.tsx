'use client';
import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fullWidth?: boolean;
}

export default function Input({ label, fullWidth, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
      )}
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: fullWidth ? '100%' : undefined,
          background: 'var(--bg-input)',
          border: `1px solid ${focused ? 'var(--teal)' : 'var(--line)'}`,
          borderRadius: '12px',
          padding: '10px 14px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-ibm), "IBM Plex Sans", sans-serif',
          fontSize: '0.9rem',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(49,214,196,0.12)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  fullWidth?: boolean;
}

export function Textarea({ label, fullWidth, style, ...props }: TextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
      )}
      <textarea
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: fullWidth ? '100%' : undefined,
          background: 'var(--bg-input)',
          border: `1px solid ${focused ? 'var(--teal)' : 'var(--line)'}`,
          borderRadius: '12px',
          padding: '12px 14px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-ibm), "IBM Plex Sans", sans-serif',
          fontSize: '0.9rem',
          outline: 'none',
          resize: 'vertical',
          minHeight: '100px',
          boxShadow: focused ? '0 0 0 3px rgba(49,214,196,0.12)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export function Select({ label, value, onChange, options, fullWidth }: SelectProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && (
        <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: fullWidth ? '100%' : undefined,
          background: 'var(--bg-input)',
          border: `1px solid ${focused ? 'var(--teal)' : 'var(--line)'}`,
          borderRadius: '12px',
          padding: '10px 14px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-ibm), "IBM Plex Sans", sans-serif',
          fontSize: '0.9rem',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%237a8f98' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: '36px',
          boxShadow: focused ? '0 0 0 3px rgba(49,214,196,0.12)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: 'var(--bg-panel)' }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
