/**
 * Validaciones para galería (imágenes y promociones)
 */
export const GALLERY_VALIDATION = {
  product: {
    minLength: 1,
    maxLength: 200,
  },
  price: {
    maxLength: 50,
  },
  order_index: {
    min: 1,
    max: 999,
  },
};

export type GalleryFormErrors = {
  product?: string;
  price?: string;
  image?: string;
  order_index?: string;
};

export function validateGallery(data: {
  product: string;
  price: string;
  order_index: number;
  existingOrders?: number[];
  isUpdate?: boolean;
}): GalleryFormErrors {
  const errors: GalleryFormErrors = {};
  const { product, price, order_index, existingOrders = [], isUpdate } = data;

  if (!product || typeof product !== "string") {
    errors.product = "El nombre del producto es obligatorio.";
  } else {
    const t = product.trim();
    if (t.length < GALLERY_VALIDATION.product.minLength) {
      errors.product = "El nombre del producto es obligatorio.";
    } else if (t.length > GALLERY_VALIDATION.product.maxLength) {
      errors.product = `Máximo ${GALLERY_VALIDATION.product.maxLength} caracteres.`;
    }
  }

  if (typeof price !== "string") {
    errors.price = "El precio es obligatorio.";
  } else if (price.trim().length > GALLERY_VALIDATION.price.maxLength) {
    errors.price = `Máximo ${GALLERY_VALIDATION.price.maxLength} caracteres.`;
  }

  if (typeof order_index !== "number" || isNaN(order_index)) {
    errors.order_index = "El orden debe ser un número.";
  } else if (order_index < GALLERY_VALIDATION.order_index.min) {
    errors.order_index = "El orden debe ser al menos 1.";
  } else if (order_index > GALLERY_VALIDATION.order_index.max) {
    errors.order_index = `El orden no puede superar ${GALLERY_VALIDATION.order_index.max}.`;
  } else if (existingOrders.includes(order_index)) {
    errors.order_index = "Ese orden ya está en uso.";
  }

  return errors;
}
