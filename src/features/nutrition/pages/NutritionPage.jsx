"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createNutritionEntry,
  deleteNutritionEntry,
  fetchNutritionEntries,
  searchFoodProducts,
  updateNutritionEntry,
} from "@/features/nutrition/api/nutritionApi";
import AppPageShell from "@/shared/components/AppPageShell";
import StatusMessage from "@/shared/components/StatusMessage";
import { formatLongDate, getTodayIsoDate, toIsoLocalDate } from "@/shared/utils/date";
import { fetchCurrentUser } from "@/features/settings/api/userApi";
import { CALORIE_TARGET_EVENT, readCalorieTarget, saveCalorieTarget } from "@/features/settings/utils/calorieTargetStorage";

const CATEGORY_LABELS = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
  GENERAL: "General",
};

const emptyForm = (date = getTodayIsoDate(), category = "GENERAL") => ({
  mealName: "",
  mealDate: date,
  calories: "",
  proteinGrams: "",
  carbsGrams: "",
  fatGrams: "",
  notes: "",
  category,
});

function toDisplayNumber(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function round(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

function getProductCalories(product) {
  return round(product.caloriesPerServing || product.caloriesPer100g);
}

function getFormFromProduct(product, date, category = "GENERAL") {
  return {
    mealName: product.name,
    mealDate: date,
    calories: String(getProductCalories(product)),
    proteinGrams: String(round(product.proteinPer100g)),
    carbsGrams: String(round(product.carbsPer100g)),
    fatGrams: String(round(product.fatPer100g)),
    notes: [product.brands?.join(", "), product.servingSize ? `Serving: ${product.servingSize}` : ""]
      .filter(Boolean)
      .join(" - "),
    category,
  };
}

function extractNumber(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return String(round(match[1].replace(",", ".")));
  }

  return "";
}

function getFormFromOcrText(text, date) {
  const normalizedText = text.replace(/\s+/g, " ").trim();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const likelyName = lines.find((line) => /[a-zA-Z]{3,}/.test(line) && !/\d/.test(line)) || lines[0] || "";

  return {
    mealName: likelyName.slice(0, 80),
    mealDate: date,
    calories: extractNumber(normalizedText, [
      /(?:calories|kcal|energy)\D{0,16}(\d+(?:[.,]\d+)?)/i,
      /(\d+(?:[.,]\d+)?)\s*(?:kcal|calories)/i,
    ]),
    proteinGrams: extractNumber(normalizedText, [
      /protein\D{0,16}(\d+(?:[.,]\d+)?)/i,
      /(\d+(?:[.,]\d+)?)\s*g\s*protein/i,
    ]),
    carbsGrams: extractNumber(normalizedText, [
      /(?:carbohydrate|carbs?)\D{0,16}(\d+(?:[.,]\d+)?)/i,
      /(\d+(?:[.,]\d+)?)\s*g\s*(?:carbohydrate|carbs?)/i,
    ]),
    fatGrams: extractNumber(normalizedText, [
      /(?:total\s+fat|fat)\D{0,16}(\d+(?:[.,]\d+)?)/i,
      /(\d+(?:[.,]\d+)?)\s*g\s*(?:total\s+fat|fat)/i,
    ]),
    notes: normalizedText,
    category: "GENERAL",
  };
}

function SegmentedControl({ value, onChange }) {
  return (
    <div className="grid grid-cols-3 rounded-lg bg-slate-100 p-1 text-xs font-bold uppercase tracking-wider dark:bg-background-dark">
      {[
        ["manual", "Manual", "edit_note"],
        ["ocr", "OCR", "document_scanner"],
        ["database", "Foods", "search"],
      ].map(([mode, label, icon]) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`flex items-center justify-center gap-1 rounded-md px-2 py-2 transition-colors ${
            value === mode ? "bg-primary text-background" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="material-icons text-sm">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function NutritionForm({ formState, editingEntryId, isSubmitting, submitError, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{editingEntryId ? "Edit food" : "Manual input"}</h2>
          <p className="text-xs text-slate-500">Enter nutrition values and save them to the diary.</p>
        </div>
        {editingEntryId ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
            aria-label="Cancel editing"
          >
            <span className="material-icons text-base">close</span>
          </button>
        ) : null}
      </div>

      <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        Food name
        <input
          required
          minLength={2}
          maxLength={255}
          value={formState.mealName}
          onChange={(event) => onChange("mealName", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Date
          <input
            required
            type="date"
            value={formState.mealDate}
            onChange={(event) => onChange("mealDate", event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
          />
        </label>
        <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
          Meal
          <select
            value={formState.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["calories", "Calories", "kcal"],
          ["proteinGrams", "Protein", "g"],
          ["carbsGrams", "Carbs", "g"],
          ["fatGrams", "Fat", "g"],
        ].map(([field, label, suffix]) => (
          <label key={field} className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
            <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-white/10 dark:bg-background-dark">
              <input
                required
                min={field === "calories" ? 1 : 0}
                max={field === "calories" ? 10000 : 1000}
                type="number"
                value={formState[field]}
                onChange={(event) => onChange(field, event.target.value)}
                className="w-full min-w-0 bg-transparent px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none dark:text-white"
              />
              <span className="grid w-12 shrink-0 place-items-center border-l border-slate-200 text-xs normal-case tracking-normal text-slate-400 dark:border-white/10">
                {suffix}
              </span>
            </div>
          </label>
        ))}
      </div>

      <label className="block space-y-1 text-xs font-bold uppercase tracking-wider text-slate-500">
        Notes
        <textarea
          maxLength={1000}
          rows={3}
          value={formState.notes}
          onChange={(event) => onChange("notes", event.target.value)}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-background-dark dark:text-white"
        />
      </label>

      {submitError ? (
        <StatusMessage tone="error" className="text-left">
          {submitError}
        </StatusMessage>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-icons text-base">{editingEntryId ? "save" : "add"}</span>
        {isSubmitting ? "Saving..." : editingEntryId ? "Update food" : "Add food"}
      </button>
    </form>
  );
}

function OcrScanner({ selectedDate, onApplyScan }) {
  const [imagePreview, setImagePreview] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [scanError, setScanError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setOcrText("");
    setScanError("");

    if (!file) {
      setImagePreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImagePreview(typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };

  const scanImage = async () => {
    if (!selectedFile) {
      setScanError("Choose an image first.");
      return;
    }

    setIsScanning(true);
    setScanError("");

    try {
      const { recognize } = await import("tesseract.js");
      const result = await recognize(selectedFile, "eng");
      const text = result?.data?.text?.trim() || "";
      setOcrText(text);

      const parsedForm = getFormFromOcrText(text, selectedDate);
      onApplyScan(parsedForm);
    } catch (error) {
      setScanError(error?.message || "Could not read this image.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">OCR scanner</h2>
        <p className="text-xs text-slate-500">Scan a nutrition label or receipt image, then review the filled form.</p>
      </div>

      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors hover:border-primary dark:border-white/10 dark:bg-background-dark">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt=""
            width={320}
            height={176}
            unoptimized
            className="max-h-44 rounded-lg object-contain"
          />
        ) : (
          <>
            <span className="material-icons text-4xl text-primary">document_scanner</span>
            <span className="mt-2 text-sm font-bold">Choose or capture image</span>
            <span className="mt-1 text-xs text-slate-500">JPG, PNG, HEIC if your browser supports it</span>
          </>
        )}
        <input accept="image/*" capture="environment" type="file" className="sr-only" onChange={handleFileChange} />
      </label>

      <button
        type="button"
        onClick={scanImage}
        disabled={isScanning || !selectedFile}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="material-icons text-base">document_scanner</span>
        {isScanning ? "Scanning..." : "Scan image"}
      </button>

      {scanError ? <StatusMessage tone="error">{scanError}</StatusMessage> : null}

      {ocrText ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-background-dark">
          <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Detected text</div>
          <p className="max-h-36 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {ocrText}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function FoodSearchPanel({ query, onQueryChange, results, isSearching, searchError, onSelectProduct }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Food database</h2>
        <p className="text-xs text-slate-500">Search products and use their nutrition values as an entry.</p>
      </div>
      <div className="relative">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="w-full rounded-lg border border-transparent bg-slate-100 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-background-dark"
          placeholder="Search foods database..."
          type="text"
        />
      </div>

      <div className="space-y-3">
        {isSearching ? <StatusMessage>Searching foods...</StatusMessage> : null}
        {searchError ? <StatusMessage tone="error">{searchError}</StatusMessage> : null}
        {!isSearching && !searchError && query.trim().length < 2 ? (
          <StatusMessage>Type at least 2 characters to search foods.</StatusMessage>
        ) : null}
        {!isSearching && query.trim().length >= 2 && results.length === 0 && !searchError ? (
          <StatusMessage>No matching foods found.</StatusMessage>
        ) : null}
        {results.map((product) => (
          <button
            key={`${product.code}-${product.name}`}
            onClick={() => onSelectProduct(product)}
            className="flex w-full gap-3 rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 dark:border-white/10 dark:hover:border-primary/60"
          >
            <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-slate-100 dark:bg-white/10">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="material-icons text-slate-400">restaurant</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold">{product.name}</div>
              <div className="mt-1 truncate text-xs text-slate-500">{product.brands?.join(", ") || "Food product"}</div>
              <div className="mt-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                {getProductCalories(product)} kcal - P {round(product.proteinPer100g)}g - C {round(product.carbsPer100g)}g - F {round(product.fatPer100g)}g
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function InputPanel({
  mode,
  setMode,
  formState,
  editingEntryId,
  isSubmitting,
  submitError,
  selectedDate,
  searchQuery,
  searchResults,
  isSearching,
  searchError,
  onFormChange,
  onSubmit,
  onCancel,
  onApplyScan,
  onSearchChange,
  onSelectProduct,
}) {
  return (
    <aside className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 dark:border-white/5 dark:bg-slate-900/50">
      <SegmentedControl value={mode} onChange={setMode} />
      <div className="mt-5">
        {mode === "manual" ? (
          <NutritionForm
            formState={formState}
            editingEntryId={editingEntryId}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onChange={onFormChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        ) : null}

        {mode === "ocr" ? <OcrScanner selectedDate={selectedDate} onApplyScan={onApplyScan} /> : null}

        {mode === "database" ? (
          <FoodSearchPanel
            query={searchQuery}
            onQueryChange={onSearchChange}
            results={searchResults}
            isSearching={isSearching}
            searchError={searchError}
            onSelectProduct={onSelectProduct}
          />
        ) : null}
      </div>
    </aside>
  );
}

function FoodLogList({ entries, isLoading, error, onEdit, onDelete }) {
  if (isLoading) return <StatusMessage className="py-12">Loading nutrition entries...</StatusMessage>;
  if (error) return <StatusMessage tone="error" className="py-12">{error}</StatusMessage>;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/5 dark:bg-slate-900/50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5 dark:border-white/5 dark:bg-white/5">
        <div>
          <h2 className="text-lg font-bold">Logged food</h2>
          <p className="text-xs text-slate-500">{entries.length} entries for this day</p>
        </div>
        <span className="material-icons text-primary">restaurant</span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {entries.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No food logged for this day.</div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-bold text-slate-900 dark:text-white">{entry.mealName}</div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {CATEGORY_LABELS[entry.category] || entry.category || "General"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {entry.calories} kcal - P {entry.proteinGrams}g - C {entry.carbsGrams}g - F {entry.fatGrams}g
                </div>
                {entry.notes ? <div className="mt-1 line-clamp-2 text-xs text-slate-400">{entry.notes}</div> : null}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => onEdit(entry)}
                  className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
                  aria-label={`Edit ${entry.mealName}`}
                >
                  <span className="material-icons text-base">edit</span>
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="rounded-lg bg-red-500/10 p-2 text-red-500 hover:bg-red-500/20"
                  aria-label={`Delete ${entry.mealName}`}
                >
                  <span className="material-icons text-base">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayIsoDate);
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formState, setFormState] = useState(emptyForm);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [inputMode, setInputMode] = useState("manual");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [calorieTarget, setCalorieTarget] = useState(() => readCalorieTarget());

  useEffect(() => {
    let isMounted = true;

    async function loadPageData() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [nextEntries, currentUser] = await Promise.all([
          fetchNutritionEntries(),
          fetchCurrentUser().catch(() => null),
        ]);
        if (!isMounted) return;

        if (currentUser?.dailyCalorieTarget) {
          saveCalorieTarget(currentUser.dailyCalorieTarget);
          setCalorieTarget(currentUser.dailyCalorieTarget);
        }
        setEntries(nextEntries);
      } catch (error) {
        if (!isMounted) return;
        setEntries([]);
        setLoadError(error.message || "Could not load nutrition entries.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) return undefined;

    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);
      setSearchError("");

      try {
        const payload = await searchFoodProducts(query);
        if (!isMounted) return;
        setSearchResults(payload.results);
      } catch (error) {
        if (!isMounted) return;
        setSearchResults([]);
        setSearchError(error.message || "Could not search foods.");
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }, 350);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    const syncCalorieTarget = (event) => {
      setCalorieTarget(event.detail ?? readCalorieTarget());
    };
    const syncStorageCalorieTarget = (event) => {
      if (event.key === "fitness.calorieTarget") setCalorieTarget(readCalorieTarget());
    };

    window.addEventListener(CALORIE_TARGET_EVENT, syncCalorieTarget);
    window.addEventListener("storage", syncStorageCalorieTarget);

    return () => {
      window.removeEventListener(CALORIE_TARGET_EVENT, syncCalorieTarget);
      window.removeEventListener("storage", syncStorageCalorieTarget);
    };
  }, []);

  const visibleEntries = useMemo(
    () => entries.filter((entry) => entry.mealDate === selectedDate),
    [entries, selectedDate]
  );

  const totals = useMemo(
    () =>
      visibleEntries.reduce(
        (next, entry) => ({
          calories: next.calories + entry.calories,
          proteinGrams: next.proteinGrams + entry.proteinGrams,
          carbsGrams: next.carbsGrams + entry.carbsGrams,
          fatGrams: next.fatGrams + entry.fatGrams,
        }),
        { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }
      ),
    [visibleEntries]
  );

  const resetForm = () => {
    setEditingEntryId(null);
    setFormState(emptyForm(selectedDate));
    setSubmitError("");
  };

  const openEditEntryForm = (entry) => {
    setEditingEntryId(entry.id);
    setFormState({
      mealName: entry.mealName,
      mealDate: entry.mealDate || selectedDate,
      calories: String(entry.calories),
      proteinGrams: String(entry.proteinGrams),
      carbsGrams: String(entry.carbsGrams),
      fatGrams: String(entry.fatGrams),
      notes: entry.notes || "",
      category: entry.category || "GENERAL",
    });
    setSubmitError("");
    setInputMode("manual");
  };

  const selectProduct = (product) => {
    setEditingEntryId(null);
    setFormState(getFormFromProduct(product, selectedDate));
    setSubmitError("");
    setInputMode("manual");
  };

  const applyOcrScan = (nextFormState) => {
    setEditingEntryId(null);
    setFormState({
      ...emptyForm(selectedDate),
      ...nextFormState,
      mealDate: selectedDate,
    });
    setSubmitError("");
    setInputMode("manual");
  };

  const submitEntry = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const savedEntry = editingEntryId
        ? await updateNutritionEntry(editingEntryId, formState)
        : await createNutritionEntry(formState);

      setEntries((current) => {
        const existingIndex = current.findIndex((entry) => entry.id === savedEntry.id);
        if (existingIndex === -1) return [savedEntry, ...current];

        const next = [...current];
        next[existingIndex] = savedEntry;
        return next;
      });
      resetForm();
    } catch (error) {
      setSubmitError(error.message || "Could not save nutrition entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEntry = async (entryId) => {
    try {
      await deleteNutritionEntry(entryId);
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
    } catch (error) {
      window.alert(error.message || "Could not delete nutrition entry.");
    }
  };

  const shiftDate = (days) => {
    setSelectedDate((currentDate) => {
      const date = new Date(`${currentDate}T00:00:00`);
      date.setDate(date.getDate() + days);
      const nextDate = toIsoLocalDate(date);
      setFormState((current) => ({ ...current, mealDate: nextDate }));
      return nextDate;
    });
  };

  const handleSearchChange = (nextQuery) => {
    setSearchQuery(nextQuery);
    if (nextQuery.trim().length < 2) {
      setSearchResults([]);
      setSearchError("");
      setIsSearching(false);
    }
  };

  const remainingCalories = calorieTarget ? Math.max(0, calorieTarget - totals.calories) : null;

  return (
    <AppPageShell>
      <div className="mx-auto max-w-[1600px] flex-1 px-6 py-8">
        <div className="mb-8 flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => shiftDate(-1)}
              className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
              aria-label="Previous day"
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold leading-none text-slate-900 dark:text-white">Food Diary</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-primary/60">
                {formatLongDate(new Date(`${selectedDate}T00:00:00`))}
              </p>
            </div>
            <button
              onClick={() => shiftDate(1)}
              className="rounded-lg bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20"
              aria-label="Next day"
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/5 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-around xl:min-w-[680px]">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{toDisplayNumber(totals.calories)}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {calorieTarget ? `of ${toDisplayNumber(calorieTarget)} kcal` : "Calories"}
              </div>
            </div>
            {calorieTarget ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{toDisplayNumber(remainingCalories)}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Remaining</div>
              </div>
            ) : null}
            <div className={`grid grid-cols-3 gap-3 ${calorieTarget ? "sm:min-w-[300px]" : "sm:min-w-[360px]"}`}>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{totals.proteinGrams}g</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-sky-400">{totals.carbsGrams}g</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-amber-400">{totals.fatGrams}g</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Fat</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <FoodLogList
              entries={visibleEntries}
              isLoading={isLoading}
              error={loadError}
              onEdit={openEditEntryForm}
              onDelete={deleteEntry}
            />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <InputPanel
              mode={inputMode}
              setMode={setInputMode}
              formState={formState}
              editingEntryId={editingEntryId}
              isSubmitting={isSubmitting}
              submitError={submitError}
              selectedDate={selectedDate}
              searchQuery={searchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              searchError={searchError}
              onFormChange={(field, value) => setFormState((current) => ({ ...current, [field]: value }))}
              onSubmit={submitEntry}
              onCancel={resetForm}
              onApplyScan={applyOcrScan}
              onSearchChange={handleSearchChange}
              onSelectProduct={selectProduct}
            />
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
