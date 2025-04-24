"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getParamsEnv } from "../../functions/getParamsEnv";

const { API_URL_BASE } = getParamsEnv();

const colors = {
  primary: "#FFB74D",
  textPrimary: "#000000",
  textSecondary: "#FFFFFF",
  border: "#BDBDBD",
};

/**
 * Modal para EDITAR producto.
 * Maneja:
 *  • AlwaysActive (descuento 24 h)
 *  • discountSchedule (array de intervalos [{ start, end }, …])
 */
export default function EditProductModal({
  show,
  handleClose,
  handleUpdate,
  selectedProduct,
}) {
  const token = useSelector((state) => state?.client?.token);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountPercentage: "",
    priceToSell: "",
    image: null,
    limitDate: "",
    preparationTime: "",
    modifiers: [],
    AlwaysActive: false,
    discountSchedule: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  /* ------------ Inicializar datos al abrir ------------ */
  useEffect(() => {
    if (!selectedProduct) return;

    const {
      name = "",
      description = "",
      price = 0,
      discountPercentage = 0,
      finalPrice = 0,
      preparationTime = "",
      AlwaysActive = false,
      // 👉 Corregido: preferimos discountSchedule; si no existe, usamos productSchedules
      discountSchedule = [],
      productSchedules = [],
      extras = [],
    } = selectedProduct;

    const sourceSchedules =
      Array.isArray(discountSchedule) && discountSchedule.length
        ? discountSchedule
        : productSchedules;

    const scheduleArray = Array.isArray(sourceSchedules)
      ? sourceSchedules.map(({ start, end }) => ({ start, end }))
      : [];

    // Fecha por defecto 5 años a futuro
    const fiveYears = new Date();
    fiveYears.setFullYear(fiveYears.getFullYear() + 5);

    setProduct({
      name,
      description,
      originalPrice: price.toString(),
      discountPercentage: discountPercentage.toString(),
      priceToSell: finalPrice.toString(),
      image: null,
      limitDate: fiveYears.toISOString().split("T")[0],
      preparationTime: preparationTime.toString(),
      modifiers: extras.map((extra) => ({
        id: extra.id,
        name: extra.name,
        required: extra.required,
        multipleSelect: !extra.onlyOne,
        options: extra.options.map((o) => ({
          id: o.id,
          name: o.name,
          price: o.price.toString(),
        })),
      })),
      AlwaysActive,
      discountSchedule: scheduleArray,
    });
  }, [selectedProduct]);

  /* ------------ Recalcular precio al cambiar inputs ------------ */
  useEffect(() => {
    const orig = parseFloat(product.originalPrice) || 0;
    const disc = parseFloat(product.discountPercentage) || 0;
    const newPrice = orig * (1 - disc / 100);
    setProduct((prev) => ({
      ...prev,
      priceToSell: isNaN(newPrice) ? "" : newPrice.toFixed(2),
    }));
  }, [product.originalPrice, product.discountPercentage]);

  /* ------------ Handlers ------------ */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "AlwaysActive") {
      setProduct((prev) => ({ ...prev, AlwaysActive: checked }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setProduct((p) => ({ ...p, image: file }));
  };

  /* --- schedule --- */
  const addScheduleInterval = () =>
    setProduct((p) => ({
      ...p,
      discountSchedule: [...p.discountSchedule, { start: "", end: "" }],
    }));

  const updateScheduleInterval = (idx, field, val) =>
    setProduct((p) => {
      const arr = [...p.discountSchedule];
      arr[idx][field] = val;
      return { ...p, discountSchedule: arr };
    });

  const removeScheduleInterval = (idx) =>
    setProduct((p) => {
      const arr = [...p.discountSchedule];
      arr.splice(idx, 1);
      return { ...p, discountSchedule: arr };
    });

  /* ------------ Validación ------------ */
  const validateForm = () => {
    if (!product.name.trim()) return toast.error("Enter a name.") && false;
    if (!product.description.trim())
      return toast.error("Enter a description.") && false;
    const orig = parseFloat(product.originalPrice);
    if (!orig || orig <= 0)
      return toast.error("Invalid original price.") && false;
    const disc = parseFloat(product.discountPercentage);
    if (!disc || disc < 1)
      return toast.error("Discount must be ≥ 1%.") && false;
    if (!product.priceToSell)
      return toast.error("Selling price cannot be empty.") && false;
    if (!product.limitDate)
      return toast.error("Select an expiration date.") && false;
    if (!product.preparationTime)
      return toast.error("Select preparation time.") && false;
    if (
      !product.AlwaysActive &&
      (!Array.isArray(product.discountSchedule) ||
        product.discountSchedule.length === 0)
    )
      return (
        toast.error('Add a schedule interval or mark "Always Active".') && false
      );
    return true;
  };

  /* ------------ Guardar ------------ */
  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);

    try {
      const payload = {
        name: product.name,
        description: product.description,
        originalPrice: product.originalPrice,
        discountPercentage: product.discountPercentage,
        priceToSell: product.priceToSell,
        image: product.image,
        limitDate: product.limitDate,
        preparationTime: product.preparationTime,
        modifiers: product.modifiers,
        AlwaysActive: product.AlwaysActive,
        discountSchedule: product.AlwaysActive
          ? null
          : product.discountSchedule,
      };

      await handleUpdate(payload);
      toast.success("Product updated successfully.");
      handleClose();
    } catch (err) {
      toast.error("Error updating product.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  /* ------------ UI ------------ */
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div
          className="p-4 flex justify-between items-center"
          style={{ backgroundColor: colors.primary }}
        >
          <h2
            className="text-xl font-semibold"
            style={{ color: colors.textSecondary }}
          >
            Edit Product
          </h2>
          <button
            onClick={handleClose}
            className="hover:opacity-80"
            style={{ color: colors.textPrimary }}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <form
          className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Name */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              Name
            </label>
            <input
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
              placeholder="Product name"
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={product.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none resize-none"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
              placeholder="Describe your product…"
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Original Price
              </label>
              <input
                type="number"
                name="originalPrice"
                value={product.originalPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Discount %
              </label>
              <input
                type="number"
                name="discountPercentage"
                min={1}
                value={product.discountPercentage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
              />
            </div>
          </div>

          {/* Selling Price */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              Selling Price
            </label>
            <input
              disabled
              value={product.priceToSell}
              className="w-full px-3 py-2 bg-gray-100 border rounded-md focus:outline-none"
              style={{ borderColor: colors.border, color: colors.textPrimary }}
            />
          </div>

          {/* Image */}
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: colors.textPrimary }}
            >
              Product Image
            </label>
            <div
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md"
              style={{ borderColor: colors.border }}
            >
              <div className="space-y-1 text-center">
                {product.image ? (
                  <img
                    src={URL.createObjectURL(product.image)}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                ) : selectedProduct?.img ? (
                  <img
                    src={selectedProduct.img}
                    alt="Product"
                    className="mx-auto h-32 w-32 object-cover rounded-md"
                  />
                ) : (
                  <svg
                    className="mx-auto h-12 w-12"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    style={{ color: colors.border }}
                  >
                    <path
                      d="M14 22l7-7m0 0l7 7m-7-7v12m10-1v7a4 4 0 01-4 4H11a4 4 0 01-4-4V19a4 4 0 014-4h1"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <div className="flex text-sm">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium"
                    style={{ color: colors.primary }}
                  >
                    <span>Upload</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1" style={{ color: colors.textPrimary }}>
                    or drag &amp; drop
                  </p>
                </div>
                <p className="text-xs" style={{ color: colors.textPrimary }}>
                  PNG/JPG up to 10 MB
                </p>
              </div>
            </div>
          </div>

          {/* Expiration & Prep Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Expiration Date
              </label>
              <input
                type="date"
                name="limitDate"
                value={product.limitDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Preparation (min)
              </label>
              <select
                name="preparationTime"
                value={product.preparationTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
              >
                <option value="">--</option>
                {[15, 20, 25, 30, 40].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AlwaysActive */}
          <div className="flex items-center space-x-2">
            <input
              id="AlwaysActive"
              type="checkbox"
              name="AlwaysActive"
              checked={product.AlwaysActive}
              onChange={handleInputChange}
            />
            <label
              htmlFor="AlwaysActive"
              className="text-sm"
              style={{ color: colors.textPrimary }}
            >
              Always Active (24 h)
            </label>
          </div>

          {/* Discount Schedule */}
          {!product.AlwaysActive && (
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: colors.textPrimary }}
              >
                Discount Schedule
              </label>
              {product.discountSchedule.map((interval, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="time"
                    value={interval.start}
                    onChange={(e) =>
                      updateScheduleInterval(idx, "start", e.target.value)
                    }
                    className="border px-2 py-1 rounded-md"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={interval.end}
                    onChange={(e) =>
                      updateScheduleInterval(idx, "end", e.target.value)
                    }
                    className="border px-2 py-1 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeScheduleInterval(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addScheduleInterval}
                className="mt-1 flex items-center gap-1 px-2 py-1 border rounded-md hover:bg-gray-100"
                style={{ borderColor: colors.border, color: colors.textPrimary }}
              >
                <PlusIcon className="h-4 w-4" />
                Add Interval
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex justify-center rounded-md px-4 py-2 font-medium shadow-sm hover:opacity-80"
            style={{
              backgroundColor: colors.primary,
              color: colors.textSecondary,
            }}
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
          <button
            onClick={handleClose}
            className="ml-3 inline-flex justify-center rounded-md border px-4 py-2 bg-white font-medium hover:bg-gray-50"
            style={{ borderColor: colors.border, color: colors.textPrimary }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
