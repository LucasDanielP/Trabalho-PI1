"use client";

import { usePathname } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { useTimerConfig } from "@/components/providers/timer-config-provider";
import { ConfigSidebar } from "@/components/foco/config-sidebar";

export default function FrameWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { sidebarAberta } = useTimerConfig();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Resize observer para observar mudanças de altura do conteúdo interno
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        // scrollHeight mede o tamanho real do conteúdo (mesmo que o pai tente esmagar),
        // quebrando o loop infinito de encolhimento.
        setContentHeight(contentRef.current.scrollHeight);
      }
    });
    
    observer.observe(contentRef.current);
    
    return () => observer.disconnect();
  }, [pathname]);

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
    <main className="min-h-screen flex items-center justify-center p-4 transition-colors duration-700 overflow-hidden" style={{ backgroundColor: '#132235' }}>
      {/* Container flex para abraçar a sidebar fluida e o card principal */}
      <div className={`flex w-full max-w-[1300px] justify-center items-stretch gap-6 transition-all duration-[400ms] ease-out`}>
        {(pathname === '/timer' || pathname === '/logs' || pathname === '/dados') && (
          <div 
            className="transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0"
            style={{
               width: sidebarAberta ? '280px' : '0px',
               opacity: sidebarAberta ? 1 : 0,
               transform: sidebarAberta ? 'translateX(0) scale(1)' : 'translateX(-40px) scale(0.95)',
               pointerEvents: sidebarAberta ? 'auto' : 'none'
            }}
          >
            <div className="w-[280px] flex h-full">
              <ConfigSidebar />
            </div>
          </div>
        )}

        {/* Container principal simulando o card da imagem */}
        <div 
          className={`relative overflow-hidden w-full ${frameMaxWidth} rounded-[2rem] border border-white/5 z-10 flex flex-col transition-[height] duration-[400ms] ease-out`}
          style={{ 
            background: 'linear-gradient(145deg, #162a3f 0%, #101d2d 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
            height: contentHeight === "auto" ? "auto" : `${contentHeight}px`
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

          <div ref={contentRef} className="relative z-10 w-full shrink-0 flex flex-col p-6 sm:p-8 md:p-10 min-h-[500px]">
            {/* Inner Content com leve transição de entrada */}
            <div key={pathname} className="w-full flex-1 flex flex-col animate-in fade-in zoom-in-[0.98] duration-[400ms] ease-out">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
