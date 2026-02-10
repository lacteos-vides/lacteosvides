import { createClient } from "@/lib/supabase/server";
import { ScaleToFit } from "@/components/productos/scale-to-fit";
import { ProductosDisplay } from "@/components/productos/productos-display";
import type { ProductWithCategory } from "@/lib/types/database";

const PRODUCTS_PER_COLUMN = 7;
const PRODUCTS_PER_PAGE = PRODUCTS_PER_COLUMN * 2; // 7 por columna × 2 columnas

/** Lista plana ordenada por categoría; páginas rellenadas fila a fila (espacios vacíos solo al final) */
function buildPagesFromProducts(rows: ProductWithCategory[]) {
  if (rows.length === 0) {
    return [{ id: 1, column1: [], column2: [] }];
  }

  const flat = rows.map((p) => ({
    name: p.name.toUpperCase(),
    price: `$${Number(p.price).toFixed(2)}`,
  }));

  const pages: { id: number; column1: { name: string; price: string }[]; column2: { name: string; price: string }[] }[] = [];

  for (let i = 0; i < flat.length; i += PRODUCTS_PER_PAGE) {
    const chunk = flat.slice(i, i + PRODUCTS_PER_PAGE);
    const col1: { name: string; price: string }[] = [];
    const col2: { name: string; price: string }[] = [];
    // Rellenar fila a fila: (0,1), (2,3), (4,5)... para que los huecos queden al final
    for (let row = 0; row < PRODUCTS_PER_COLUMN; row++) {
      const idxLeft = row * 2;
      const idxRight = row * 2 + 1;
      if (idxLeft < chunk.length) col1.push(chunk[idxLeft]);
      if (idxRight < chunk.length) col2.push(chunk[idxRight]);
    }
    pages.push({
      id: pages.length + 1,
      column1: col1,
      column2: col2,
    });
  }

  return pages.length > 0 ? pages : [{ id: 1, column1: [], column2: [] }];
}

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products_with_category")
    .select("id, name, price, order_index, category_id, category_name, category_order, estado")
    .eq("estado", "activo")
    .order("category_order", { ascending: true })
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  const rows = (data ?? []) as ProductWithCategory[];
  const pages = buildPagesFromProducts(rows);

  return (
    <ScaleToFit>
      <div className="h-full w-full">
        <ProductosDisplay initialPages={pages} />
      </div>
    </ScaleToFit>
  );
}
