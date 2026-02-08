import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GalleryTable } from "./gallery-table";

export default async function GaleriaPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("galeria")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Galería</h2>
          <p className="mt-1 text-slate-600">
            Imágenes y promociones para el carrusel en pantalla TV
          </p>
        </div>
        <Link
          href="/admin/galeria/add"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 font-medium text-slate-900 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          Nueva imagen
        </Link>
      </div>

      <GalleryTable items={items ?? []} />
    </div>
  );
}
