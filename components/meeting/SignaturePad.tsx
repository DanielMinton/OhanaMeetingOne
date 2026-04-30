'use client';
import { useRef, useEffect, useCallback } from 'react';
import Button from '../ui/Button';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface SignaturePadProps {
  label: string;
  onSave: (dataUrl: string) => void;
  saved?: boolean;
}

export default function SignaturePad({ label, onSave, saved }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);

  const getCtx = () => {
    const canvas = canvasRef.current;
    return canvas ? canvas.getContext('2d') : null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const t = e.touches[0];
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const pos = getPos(e);
    pointsRef.current = [{ ...pos, time: Date.now() }];
  };

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;

    const pos = getPos(e);
    const now = Date.now();
    const prev = pointsRef.current[pointsRef.current.length - 1];
    pointsRef.current.push({ ...pos, time: now });

    if (pointsRef.current.length < 2) return;

    const speed = prev ? Math.sqrt((pos.x - prev.x) ** 2 + (pos.y - prev.y) ** 2) / (now - prev.time + 1) : 1;
    const lineWidth = Math.max(1.5, Math.min(3, 3 - speed * 0.8));

    const points = pointsRef.current;
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'var(--teal)';
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }, []);

  const endDraw = () => {
    isDrawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
    pointsRef.current = [];
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL('image/png'));
  };

  return (
    <div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div
        style={{
          background: 'var(--bg-input)',
          border: `1px solid ${saved ? 'var(--teal)' : 'var(--line)'}`,
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'crosshair',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '120px', touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {/* Signature line */}
        <div style={{ position: 'absolute', bottom: '28px', left: '20px', right: '20px', borderBottom: '1px solid var(--line)', pointerEvents: 'none' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
        <Button variant="ghost" size="sm" onClick={clear}>Clear</Button>
        <Button size="sm" onClick={save}>{saved ? '✓ Saved' : 'Save Signature'}</Button>
      </div>
    </div>
  );
}
