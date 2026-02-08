import Link from "next/link";
import Image from "next/image";
import {
  Package,
  LayoutGrid,
  Images,
  Video,
  ArrowRight,
  Lock,
} from "lucide-react";

const routes = [
  {
    href: "/productos",
    icon: Package,
    label: "Productos",
    description: "Menú de productos (v1)",
    enabled: true,
  },
  {
    href: "/productosv2",
    icon: LayoutGrid,
    label: "Productos v2",
    description: "Menú de productos con branding",
    enabled: true,
  },
  {
    href: "/galeria",
    icon: Images,
    label: "Galería",
    description: "Carrusel de imágenes",
    enabled: false,
  },
  {
    href: "/videos",
    icon: Video,
    label: "Videos",
    description: "Reproductor de videos",
    enabled: false,
  },
];

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Fondo con imagen de marca + overlay oscuro */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] scale-105 md:hidden"
          style={{ backgroundImage: "url('/brand/LAST%20VERSION%20VIDES%20BRAND.png')" }}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat blur-[2px] scale-105 md:block"
          style={{ backgroundImage: "url('/brand/BANNER%20PARA%20IMPRESION2.png')" }}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4 py-8">
        {/* Card central tipo login */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex justify-center">
              <Image
                src="/brand/IMAGEN_PRINCIPAL.png"
                alt="Lácteos Vides"
                width={80}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Lácteos Vides
            </h1>
          </div>

          {/* Grid de cards de navegación */}
          <div className="grid gap-4 sm:grid-cols-2">
            {routes.map((route) => {
              const Icon = route.icon;
              const content = (
                <>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-700/80 text-amber-400 group-hover:bg-amber-500/20 group-hover:text-amber-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">{route.label}</h3>
                    <p className="text-sm text-slate-400">{route.description}</p>
                  </div>
                  {route.enabled ? (
                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-amber-400" />
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-600/80 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                      Próximamente
                    </span>
                  )}
                </>
              );

              if (route.enabled) {
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-600/50 bg-slate-700/30 p-5 transition hover:border-amber-500/40 hover:bg-slate-700/50"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  key={route.href}
                  className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-slate-600/30 bg-slate-700/20 p-5 opacity-75"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-700/80 text-slate-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-400">{route.label}</h3>
                    <p className="text-sm text-slate-500">{route.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-600/80 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    Próximamente
                  </span>
                </div>
              );
            })}
          </div>

          {/* Link al admin */}
          <div className="mt-8 border-t border-slate-600/50 pt-6 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition hover:text-amber-300"
            >
              <Lock className="h-4 w-4" />
              Panel de administración
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
