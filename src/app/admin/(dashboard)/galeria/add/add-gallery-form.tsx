"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveGalleryRecord } from "../actions";
import { useToast } from "@/components/ui/toast";
import {
  uploadImageWithProgress,
  validateImageSize,
  formatFileSize,
  MAX_SIZE_MB,
} from "@/lib/image-upload";
import { ImageIcon, CheckCircle2 } from "lucide-react";

type Props = {
  defaultOrder: number;
};

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

export function AddGalleryForm({ defaultOrder }: Props) {
  const router = useRouter();
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError(null);
    setSelectedFile(null);

    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXT.includes(ext)) {
      setFileError("Formatos permitidos: JPG, PNG, WebP, GIF");
      return;
    }

    const sizeError = validateImageSize(file.size);
    if (sizeError) {
      setFileError(sizeError);
      return;
    }

    setSelectedFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current || !selectedFile) {
      if (!selectedFile) setFileError("Selecciona una imagen.");
      return;
    }

    const formData = new FormData(formRef.current);
    const product = (formData.get("product") as string)?.trim() ?? "";
    const price = (formData.get("price") as string)?.trim() ?? "";
    const order_index = parseInt(String(formData.get("order_index") ?? "1"), 10);

    if (!product) {
      toast.error("Error", "El nombre del producto es obligatorio.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        toast.error("Sesión expirada", "Inicia sesión nuevamente.");
        setUploading(false);
        return;
      }

      const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;

      const { publicUrl } = await uploadImageWithProgress(
        selectedFile,
        path,
        session.access_token,
        (percent) => setUploadProgress(percent)
      );

      const saveData = new FormData();
      saveData.set("product", product);
      saveData.set("price", price);
      saveData.set("order_index", String(order_index));
      saveData.set("image_url", publicUrl);

      const result = await saveGalleryRecord({ ok: false, errors: {} }, saveData);

      if (result.ok) {
        toast.success("Imagen agregada", "La imagen se subió correctamente.");
        router.push("/admin/galeria");
      } else if ("errors" in result) {
        const first = Object.values(result.errors)[0];
        toast.error("Error al guardar", typeof first === "string" ? first : "Revisa los campos.");
      }
    } catch (err) {
      toast.error(
        "Error al subir",
        err instanceof Error ? err.message : "No se pudo subir la imagen."
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label htmlFor="product" className="mb-1.5 block text-sm font-medium text-slate-700">
          Producto (nombre)
        </label>
        <input
          id="product"
          name="product"
          type="text"
          required
          disabled={uploading}
          placeholder="Ej: Queso Oaxaca"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-70"
        />
      </div>

      <div>
        <label htmlFor="price" className="mb-1.5 block text-sm font-medium text-slate-700">
          Precio
        </label>
        <input
          id="price"
          name="price"
          type="text"
          disabled={uploading}
          placeholder="Ej: $5.99"
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-70"
        />
      </div>

      <div>
        <label htmlFor="order_index" className="mb-1.5 block text-sm font-medium text-slate-700">
          Orden en el carrusel
        </label>
        <input
          id="order_index"
          name="order_index"
          type="number"
          min={1}
          disabled={uploading}
          defaultValue={defaultOrder}
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-70"
        />
      </div>

      <div>
        <label htmlFor="file" className="mb-1.5 block text-sm font-medium text-slate-700">
          Imagen
        </label>
        <div className="flex flex-col gap-3">
          <input
            id="file"
            name="file"
            type="file"
            accept={ACCEPT}
            disabled={uploading}
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file"
            className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed px-4 py-4 transition ${
              selectedFile
                ? "border-green-300 bg-green-50"
                : "border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/50"
            } ${uploading ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                selectedFile ? "bg-green-200 text-green-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {selectedFile ? (
                <CheckCircle2 className="h-6 w-6" />
              ) : (
                <ImageIcon className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              {selectedFile ? (
                <>
                  <p className="font-medium text-slate-900">{selectedFile.name}</p>
                  <p className="text-sm text-slate-600">
                    {formatFileSize(selectedFile.size)} — Clic para cambiar
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-700">Seleccionar imagen</p>
                  <p className="text-sm text-slate-500">
                    JPG, PNG, WebP, GIF. Máx. {MAX_SIZE_MB} MB
                  </p>
                </>
              )}
            </div>
          </label>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subiendo...</span>
                <span className="font-medium text-amber-600">{uploadProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {fileError && <p className="text-sm text-red-600">{fileError}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/admin/galeria")}
          disabled={uploading}
          className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={uploading || !selectedFile}
          className="inline-flex min-w-[140px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
              {uploadProgress}%
            </>
          ) : (
            "Subir imagen"
          )}
        </button>
      </div>
    </form>
  );
}
