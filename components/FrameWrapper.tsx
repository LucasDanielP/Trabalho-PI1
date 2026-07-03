"use client";

import { usePathname } from "next/navigation";
import { CSSProperties, ReactNode } from "react";

export default function FrameWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Definindo estilos padrão (Home /)
  let glow1Style: CSSProperties = { top: '-20%', left: '-10%', width: '300px', height: '300px', opacity: 0.20 };
  let glow2Style: CSSProperties = { top: '70%', left: '70%', width: '250px', height: '250px', opacity: 0.18 };
  let glow3Style: CSSProperties = { top: '50%', left: '50%', width: '0px', height: '0px', opacity: 0 };
  let frameMaxWidth = 'max-w-md';

  if (pathname === '/cadastro') {
    glow1Style = { top: '-20%', left: '60%', width: '300px', height: '300px', opacity: 0.20 };
    glow2Style = { top: '70%', left: '-10%', width: '250px', height: '250px', opacity: 0.18 };
    glow3Style = { top: '50%', left: '50%', width: '0px', height: '0px', opacity: 0 };
    frameMaxWidth = 'max-w-md';
  } else if (pathname === '/login') {
    glow1Style = { top: '10%', left: '10%', width: '350px', height: '350px', opacity: 0.16 };
    glow2Style = { top: '30%', left: '20%', width: '250px', height: '250px', opacity: 0.16 };
    glow3Style = { top: '50%', left: '50%', width: '0px', height: '0px', opacity: 0 };
    frameMaxWidth = 'max-w-md';
  } else if (pathname === '/timer' || pathname === '/logs' || pathname === '/dados') {
    // Menores, espalhadas e não centralizadas (uma na esquerda alta, uma na direita baixa, uma no centro inferior)
    glow1Style = { top: '20%', left: '20%', width: '350px', height: '350px', opacity: 0.10, transform: 'translate(-50%, -50%)' };
    glow2Style = { top: '80%', left: '75%', width: '300px', height: '300px', opacity: 0.08, transform: 'translate(-50%, -50%)' };
    glow3Style = { top: '60%', left: '30%', width: '250px', height: '250px', opacity: 0.07, transform: 'translate(-50%, -50%)' };
    frameMaxWidth = 'max-w-4xl min-h-[500px] justify-between'; // Ampliado para max-w-4xl a pedido do usuário
  } else if (pathname.startsWith('/usuarios')) {
    glow1Style = { top: '-20%', left: '60%', width: '300px', height: '300px', opacity: 0.20 };
    glow2Style = { top: '70%', left: '-10%', width: '250px', height: '250px', opacity: 0.18 };
    glow3Style = { top: '50%', left: '50%', width: '0px', height: '0px', opacity: 0 };
    frameMaxWidth = 'max-w-3xl';
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 transition-colors duration-700" style={{ backgroundColor: '#132235' }}>
      
      {/* Container principal simulando o card da imagem */}
      <div 
        className={`relative overflow-hidden w-full ${frameMaxWidth} p-8 sm:p-10 rounded-[2rem] border border-white/5 z-10 flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]`}
        style={{ 
          background: 'linear-gradient(145deg, #162a3f 0%, #101d2d 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Mancha verde interna 1 */}
        <div 
          className="absolute rounded-full bg-[#04D939] blur-[60px] pointer-events-none transition-all duration-1000 ease-in-out"
          style={glow1Style}
        ></div>

        {/* Mancha verde interna 2 */}
        <div 
          className="absolute rounded-full bg-[#04D939] blur-[70px] pointer-events-none transition-all duration-1000 ease-in-out"
          style={glow2Style}
        ></div>

        {/* Mancha verde interna 3 */}
        <div 
          className="absolute rounded-full bg-[#04D939] blur-[60px] pointer-events-none transition-all duration-1000 ease-in-out"
          style={glow3Style}
        ></div>

        {/* Inner Content com leve transição de entrada */}
        <div className="relative z-10 w-full animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
      </div>
    </main>
  );
}
