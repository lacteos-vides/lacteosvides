"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2, GripVertical, ImageIcon } from "lucide-react";
import type { GalleryItem } from "@/lib/types/database";
import { deleteGalleryItem, reorderGalleryItems } from "./actions";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { useToast } from "@/components/ui/toast";

function SortableGalleryRow({
  item,
  onDelete,
  deleting,
}: {
  item: GalleryItem;
  onDelete: () => void;
  deleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`hover:bg-slate-50 ${isDragging ? "bg-white shadow-lg" : ""}`}
    >
      <td className="px-4 py-3">
        <span
          {...attributes}
          {...listeners}
          className="flex cursor-grab touch-none items-center gap-1 text-slate-500 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
          {item.order_index}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="relative h-12 w-16 overflow-hidden rounded border border-slate-200 bg-slate-100">
          <Image
            src={item.image_url}
            alt={item.product}
            fill
            className="object-cover"
            sizes="64px"
            unoptimized
          />
        </div>
      </td>
      <td className="px-4 py-3 font-medium text-slate-900">{item.product}</td>
      <td className="px-4 py-3 text-amber-600">{item.price}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex cursor-pointer justify-end gap-2">
          <Link
            href={`/admin/galeria/${item.id}/edit`}
            className="cursor-pointer rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600"
            title="Editar"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="cursor-pointer rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function GalleryTable({ items }: { items: GalleryItem[] }) {
  const [listItems, setListItems] = useState(items);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; product: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setListItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = listItems.findIndex((i) => i.id === active.id);
    const newIndex = listItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newItems = arrayMove(listItems, oldIndex, newIndex);
    setListItems(newItems);

    setReordering(true);
    const updates = newItems.map((i, idx) => ({ id: i.id, order_index: idx + 1 }));
    const { ok, error } = await reorderGalleryItems(updates);
    setReordering(false);

    if (ok) {
      toast.success("Orden actualizado", "Las imágenes se reordenaron correctamente.");
    } else {
      toast.error("Error al reordenar", error ?? "No se pudo guardar el orden.");
    }
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    setDeleting(true);
    const { ok, error } = await deleteGalleryItem(itemToDelete.id);
    setDeleting(false);
    setItemToDelete(null);
    if (ok) {
      setListItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      toast.success("Imagen eliminada", "La imagen se eliminó correctamente.");
    } else {
      toast.error("Error al eliminar", error ?? "No se pudo eliminar.");
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="w-10 px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Orden {reordering && "(guardando...)"}
                </th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Imagen
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                  Precio
                </th>
                <th className="w-32 px-4 py-3 text-right text-xs font-medium text-slate-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {listItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    No hay imágenes. Sube la primera desde &quot;Nueva imagen&quot;.
                  </td>
                </tr>
              ) : (
                <SortableContext
                  items={listItems.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {listItems.map((item) => (
                    <SortableGalleryRow
                      key={item.id}
                      item={item}
                      onDelete={() => setItemToDelete({ id: item.id, product: item.product })}
                      deleting={deleting && itemToDelete?.id === item.id}
                    />
                  ))}
                </SortableContext>
              )}
            </tbody>
          </table>
        </div>
      </DndContext>

      {itemToDelete && (
        <DeleteConfirmModal
          title="Eliminar imagen"
          message={`¿Eliminar la imagen de "${itemToDelete.product}"? El archivo también se borrará del almacenamiento.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setItemToDelete(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
