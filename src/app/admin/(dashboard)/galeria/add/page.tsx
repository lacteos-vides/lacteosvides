import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddGalleryForm } from "./add-gallery-form";

export default async function AddGalleryPage() {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("galeria")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.order_index ?? 0) + 1;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/galeria"
          className="inline-flex cursor-pointer items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          ← Volver a galería
        </Link>
      </div>
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">Nueva imagen</h2>
        <AddGalleryForm defaultOrder={nextOrder} />
      </div>
    </div>
  );
}
