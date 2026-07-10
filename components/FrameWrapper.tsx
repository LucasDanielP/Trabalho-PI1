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

  const [blobPositions, setBlobPositions] = useState<{t: string, l: string}[]>([
    { t: '-20%', l: '-10%' },
    { t: '110%', l: '110%' },
    { t: '50%', l: '50%' }
  ]);

  useEffect(() => {
    // Definimos 4 regiões seguras (quadrantes) para evitar que as manchas se colem
    const quadrants = [
      { tMin: 5, tMax: 35, lMin: 5, lMax: 35 },     // Top-Left
      { tMin: 65, tMax: 95, lMin: 65, lMax: 95 },   // Bottom-Right
      { tMin: 65, tMax: 95, lMin: 5, lMax: 35 },    // Bottom-Left
      { tMin: 5, tMax: 35, lMin: 65, lMax: 95 },    // Top-Right
    ];
    
    // Embaralha os quadrantes
    quadrants.sort(() => Math.random() - 0.5);
    
    const randomPercent = (min: number, max: number) => `${Math.floor(Math.random() * (max - min + 1)) + min}%`;
    
    setBlobPositions([
      { t: randomPercent(quadrants[0].tMin, quadrants[0].tMax), l: randomPercent(quadrants[0].lMin, quadrants[0].lMax) },
      { t: randomPercent(quadrants[1].tMin, quadrants[1].tMax), l: randomPercent(quadrants[1].lMin, quadrants[1].lMax) },
      { t: randomPercent(quadrants[2].tMin, quadrants[2].tMax), l: randomPercent(quadrants[2].lMin, quadrants[2].lMax) },
    ]);
  }, [pathname]);

  // Definindo estilos padrão (Home /)
  let glow1Style: CSSProperties = { top: blobPositions[0].t, left: blobPositions[0].l, width: '300px', height: '300px', opacity: 0.20, transform: 'translate(-50%, -50%)' };
  let glow2Style: CSSProperties = { top: blobPositions[1].t, left: blobPositions[1].l, width: '250px', height: '250px', opacity: 0.18, transform: 'translate(-50%, -50%)' };
  let glow3Style: CSSProperties = { top: blobPositions[2].t, left: blobPositions[2].l, width: '0px', height: '0px', opacity: 0, transform: 'translate(-50%, -50%)' };
  let frameMaxWidth = 'max-w-md';

  if (pathname === '/cadastro' || pathname === '/login') {
    glow1Style = { top: blobPositions[0].t, left: blobPositions[0].l, width: '400px', height: '400px', opacity: 0.15, transform: 'translate(-50%, -50%)' };
    glow2Style = { top: blobPositions[1].t, left: blobPositions[1].l, width: '350px', height: '350px', opacity: 0.15, transform: 'translate(-50%, -50%)' };
    glow3Style = { top: blobPositions[2].t, left: blobPositions[2].l, width: '0px', height: '0px', opacity: 0, transform: 'translate(-50%, -50%)' };
    frameMaxWidth = 'max-w-md';
  } else if (pathname === '/timer' || pathname === '/logs' || pathname === '/dados') {
    glow1Style = { top: blobPositions[0].t, left: blobPositions[0].l, width: '400px', height: '400px', opacity: 0.15, transform: 'translate(-50%, -50%)' };
    glow2Style = { top: blobPositions[1].t, left: blobPositions[1].l, width: '500px', height: '500px', opacity: 0.1, transform: 'translate(-50%, -50%)' };
    glow3Style = { top: blobPositions[2].t, left: blobPositions[2].l, width: '300px', height: '300px', opacity: 0.12, transform: 'translate(-50%, -50%)' };
    frameMaxWidth = 'max-w-4xl min-h-[500px] justify-between';
  } else if (pathname.startsWith('/usuarios')) {
    glow1Style = { top: blobPositions[0].t, left: blobPositions[0].l, width: '300px', height: '300px', opacity: 0.20, transform: 'translate(-50%, -50%)' };
    glow2Style = { top: blobPositions[1].t, left: blobPositions[1].l, width: '250px', height: '250px', opacity: 0.18, transform: 'translate(-50%, -50%)' };
    glow3Style = { top: blobPositions[2].t, left: blobPositions[2].l, width: '0px', height: '0px', opacity: 0, transform: 'translate(-50%, -50%)' };
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

          <div ref={contentRef} className="relative z-10 w-full shrink-0 flex flex-col p-6 sm:p-8 md:p-10">
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
