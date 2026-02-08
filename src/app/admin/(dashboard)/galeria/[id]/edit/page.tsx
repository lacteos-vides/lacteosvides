import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditGalleryForm } from "./edit-gallery-form";

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("galeria")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

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
        <h2 className="mb-6 text-2xl font-semibold text-slate-900">
          Editar imagen: {item.product}
        </h2>
        <EditGalleryForm item={item} />
      </div>
    </div>
  );
}
