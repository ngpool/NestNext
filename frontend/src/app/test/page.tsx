"use client";

import Lightning from './components/lightning';

export default function TestPage() {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Lightning
        hue={220}
        xOffset={0}
        speed={1}
        intensity={1}
        size={1}
      />
    </div>
  );
}