"use client";

/* Pantalla de productos para TV - optimizada para dispositivos con poca RAM */

import { useEffect, useState } from "react";
import { ScaleToFit } from "@/components/productos/scale-to-fit";
import { Clock } from "@/components/productos/clock";
import { ProductCard } from "@/components/productos/product-card";

interface Product {
  id: number;
  name: string;
  price: string;
}

const products: Product[] = [
  { id: 1, name: "Leche Entera 1L", price: "$25.00" },
  { id: 2, name: "Leche Deslactosada 1L", price: "$28.00" },
  { id: 3, name: "Queso Fresco 500g", price: "$65.00" },
  { id: 4, name: "Queso Panela 400g", price: "$55.00" },
  { id: 5, name: "Queso Oaxaca 500g", price: "$75.00" },
  { id: 6, name: "Queso Manchego 500g", price: "$85.00" },
  { id: 7, name: "Yogurt Natural 1L", price: "$35.00" },
  { id: 8, name: "Yogurt de Fresa 1L", price: "$38.00" },
  { id: 9, name: "Crema 500ml", price: "$45.00" },
  { id: 10, name: "Mantequilla 250g", price: "$48.00" },
  { id: 11, name: "Requesón 250g", price: "$32.00" },
  { id: 12, name: "Jocoque 500ml", price: "$35.00" },
  { id: 13, name: "Queso Cottage 250g", price: "$42.00" },
  { id: 14, name: "Leche Descremada 1L", price: "$26.00" },
];

export default function ProductosDisplayPage() {
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % products.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const midPoint = Math.ceil(products.length / 2);
  const column1 = products.slice(0, midPoint);
  const column2 = products.slice(midPoint);

  return (
    <ScaleToFit>
      <div className="relative h-full w-full overflow-hidden bg-slate-900">
        {/* Fondo azul oscuro con gradiente visible y textura */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #334155 50%, #1e293b 70%, #0f172a 100%),
              linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.6) 100%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Contenido principal */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <header className="animate-enter-fade-down px-10 pb-3 pt-5">
            <div className="flex items-center justify-between">
              <div className="animate-logo-pulse flex items-center gap-6">
                <img
                  src="/brand/IMAGEN_PRINCIPAL.png"
                  alt="Logo Lácteos Vides"
                  className="h-28 w-28 rounded-full drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
                />
                <div>
                  <h1
                    className="text-7xl font-black text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
                    style={{
                      fontFamily: "Impact, sans-serif",
                      letterSpacing: "0.05em",
                    }}
                  >
                    LÁCTEOS VIDES
                  </h1>
                  <p
                    className="mt-1 text-2xl font-bold text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                    style={{ fontStyle: "italic" }}
                  >
                    La Mejor Calidad al Mejor Precio
                  </p>
                </div>
              </div>
              <Clock />
            </div>
          </header>

          {/* Separador */}
          <div className="animate-enter-scale-x mx-10 mb-3">
            <div className="h-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 shadow-lg" />
          </div>

          {/* Título */}
          <div className="animate-enter-fade-scale mb-6 text-center">
            <h2 className="text-5xl font-black text-yellow-300 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]">
              NUESTROS PRODUCTOS
            </h2>
          </div>

          {/* Grid de productos - pt-4 para que el zoom del primer producto no se corte arriba */}
          <div className="flex-1 overflow-hidden px-8 pb-3 pt-4">
            <div className="mx-auto grid h-full w-full max-w-[1700px] grid-cols-2 gap-x-16 gap-y-4">
              <div className="animate-enter-slide-left space-y-3">
                {column1.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    isActive={activeProductIndex === index}
                    delayMs={800 + index * 100}
                  />
                ))}
              </div>
              <div className="animate-enter-slide-right space-y-3">
                {column2.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    name={product.name}
                    price={product.price}
                    isActive={activeProductIndex === midPoint + index}
                    delayMs={800 + index * 100}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="py-3 text-center">
            <div className="animate-footer-float inline-block">
              <p className="text-3xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                🐄 ¡FRESCURA Y CALIDAD GARANTIZADA! 🐄
              </p>
            </div>
          </footer>
        </div>
      </div>
    </ScaleToFit>
  );
}
