"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { BadgeInfoIcon, Check } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, get, useFormContext } from "react-hook-form";
import { Dialog, DialogContent } from "../ui/dialog";

// ─── Default Colors ───────────────────────────────────────
const DEFAULT_COLORS = ["#FF5733", "#3357FF", "#33FF57", "#F1C40F", "#9B59B6"];

// ─── Color Utils ──────────────────────────────────────────
const colorUtils = {
  hsbToRgb: (h: number, s: number, b: number): [number, number, number] => {
    s = s / 100;
    b = b / 100;
    const k = (n: number) => (n + h / 60) % 6;
    const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [Math.round(255 * f(5)), Math.round(255 * f(3)), Math.round(255 * f(1))];
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
        .toUpperCase()
    );
  },

  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const expanded = hex.length === 4 ? "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  rgbToHsb: (r: number, g: number, b: number): { h: number; s: number; b: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    let h = 0;
    if (max !== min) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), b: Math.round(v * 100) };
  },
};

// ─── Color Picker Popup ───────────────────────────────────
function ColorPickerPopup({
  initialColor,
  onSelect,
  onCancel,
}: {
  initialColor: string;
  onSelect: (color: string) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [hexInput, setHexInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);

  // Init from initial color
  useEffect(() => {
    if (initialColor) {
      const rgb = colorUtils.hexToRgb(initialColor);
      if (rgb) {
        const hsb = colorUtils.rgbToHsb(rgb.r, rgb.g, rgb.b);
        setHue(hsb.h);
        setSaturation(hsb.s);
        setBrightness(hsb.b);
      }
    }
  }, [initialColor]);

  // Draw gradient canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const { width, height } = canvas;
    const [r, g, b] = colorUtils.hsbToRgb(hue, 100, 100);
    const gradH = ctx.createLinearGradient(0, 0, width, 0);
    gradH.addColorStop(0, "#FFFFFF");
    gradH.addColorStop(1, `rgb(${r},${g},${b})`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, width, height);
    const gradV = ctx.createLinearGradient(0, 0, 0, height);
    gradV.addColorStop(0, "rgba(0,0,0,0)");
    gradV.addColorStop(1, "#000000");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);

  // Sync hex input
  useEffect(() => {
    const [r, g, b] = colorUtils.hsbToRgb(hue, saturation, brightness);
    setHexInput(colorUtils.rgbToHex(r, g, b));
  }, [hue, saturation, brightness]);

  const handleCanvasInteraction = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setSaturation((x / rect.width) * 100);
    setBrightness(100 - (y / rect.height) * 100);
  }, []);

  const handleHueInteraction = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHue((x / rect.width) * 360);
  }, []);

  const handleHexInput = (val: string) => {
    let cleaned = val.replace(/[^#0-9a-fA-F]/g, "");
    if (cleaned && !cleaned.startsWith("#")) cleaned = "#" + cleaned;
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7);
    setHexInput(cleaned);
    if (/^#([a-f\d]{6})$/i.test(cleaned)) {
      const rgb = colorUtils.hexToRgb(cleaned);
      if (rgb) {
        const hsb = colorUtils.rgbToHsb(rgb.r, rgb.g, rgb.b);
        setHue(hsb.h);
        setSaturation(hsb.s);
        setBrightness(hsb.b);
      }
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDraggingHue(false);
    };
    if (isDragging || isDraggingHue) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging, isDraggingHue]);

  const [r, g, b] = colorUtils.hsbToRgb(hue, saturation, brightness);
  const currentColor = colorUtils.rgbToHex(r, g, b);

  return (
    <div className="w-full space-y-3 pt-2">
      {/* Canvas */}
      <div className="relative overflow-hidden rounded-lg ring-1 ring-black/10">
        <canvas
          ref={canvasRef}
          width={256}
          height={160}
          className="w-full cursor-crosshair"
          onMouseDown={(e) => {
            setIsDragging(true);
            handleCanvasInteraction(e);
          }}
          onMouseMove={(e) => {
            if (isDragging) handleCanvasInteraction(e);
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />
        {/* Cursor */}
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
          style={{
            left: `${saturation}%`,
            top: `${100 - brightness}%`,
            boxShadow: "0 0 0 1.5px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>

      {/* Hue Slider */}
      <div
        className="relative h-3 cursor-pointer rounded-full"
        style={{
          background:
            "linear-gradient(to right, #FF0000 0%, #FFFF00 17%, #00FF00 33%, #00FFFF 50%, #0000FF 67%, #FF00FF 83%, #FF0000 100%)",
        }}
        onMouseDown={(e) => {
          setIsDraggingHue(true);
          handleHueInteraction(e);
        }}
        onMouseMove={(e) => {
          if (isDraggingHue) handleHueInteraction(e);
        }}
        onMouseUp={() => setIsDraggingHue(false)}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg"
          style={{ left: `${(hue / 360) * 100}%`, backgroundColor: `hsl(${hue}, 100%, 50%)` }}
        />
      </div>

      {/* Preview + Hex Input */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 shrink-0 rounded-lg border-2" style={{ backgroundColor: currentColor }} />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexInput(e.target.value)}
          className="bg-background focus:ring-primary/40 w-full rounded-lg border px-3 py-1.5 font-mono text-sm focus:ring-2 focus:outline-none dark:border-[#2a2a2e] dark:bg-[#18181C]"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="hover:bg-muted/50 flex-1 rounded-full border px-3 py-1.5 text-sm font-medium transition dark:border-[#2a2a2e]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSelect(currentColor)}
          className="cool bg-foreground text-background flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition hover:opacity-90 dark:bg-white dark:text-black"
        >
          Use Color
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
interface IProps {
  label?: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  presetColors?: string[];
}

export default function ColorPickerField({ label, name, required, disabled, presetColors = DEFAULT_COLORS }: IProps) {
  const form = useFormContext();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, formState: { errors } }) => {
        const selectedColor = field.value || "";
        const isPreset = presetColors.includes(selectedColor);

        const handleSelect = (color: string) => {
          field.onChange(color);
          form.clearErrors(name);
          setIsPickerOpen(false);
        };

        return (
          <Field className="gap-1">
            {label && (
              <FieldLabel>
                <div>{label}</div>
              </FieldLabel>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {/* Preset Swatches */}
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    field.onChange(color);
                    form.clearErrors(name);
                  }}
                  className={cn(
                    "relative h-9 w-9 rounded-full border-2 transition-all focus:outline-none",
                    selectedColor === color
                      ? "border-foreground scale-110 shadow-md"
                      : "border-transparent hover:scale-105 hover:border-gray-300",
                    disabled && "cursor-not-allowed opacity-50"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                >
                  {selectedColor === color && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" strokeWidth={3} />}
                </button>
              ))}

              {/* Custom Color Button */}
              <button
                type="button"
                disabled={disabled}
                onClick={() => setIsPickerOpen(true)}
                className={cn(
                  "relative h-9 w-9 overflow-hidden rounded-full border-2 transition-all focus:outline-none",
                  !isPreset && selectedColor
                    ? "border-foreground scale-110 shadow-md"
                    : "border-dashed border-gray-300 hover:scale-105 hover:border-gray-400",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                style={{ backgroundColor: !isPreset && selectedColor ? selectedColor : "transparent" }}
                aria-label="Pick custom color"
              >
                {!isPreset && selectedColor ? (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" strokeWidth={3} />
                ) : (
                  <span className="text-lg leading-none text-gray-400">+</span>
                )}
              </button>

              {/* Selected Color Pill */}
              {selectedColor && (
                <div className="flex items-center gap-2 rounded-full border px-3 py-1 dark:border-[#2a2a2e]">
                  <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: selectedColor }} />
                  <span className="text-muted-foreground font-mono text-xs">{selectedColor.toUpperCase()}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange("")}
                    className="text-muted-foreground hover:text-destructive ml-1 text-xs leading-none focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Picker Modal */}
            {isPickerOpen && (
              <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                <DialogContent className="sm:max-w-sm">
                  <ColorPickerPopup
                    initialColor={selectedColor || "#000000"}
                    onSelect={handleSelect}
                    onCancel={() => setIsPickerOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            )}

            {/* Error */}
            {required && get(errors, name) && (
              <div className="text-destructive flex items-center gap-1">
                <BadgeInfoIcon className="size-4" />
                <FieldError errors={[{ message: `${get(errors, name)?.message || "Color is required!"}` }]} />
              </div>
            )}
          </Field>
        );
      }}
    />
  );
}
