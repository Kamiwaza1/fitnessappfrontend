import { fetchAuthenticatedJson } from "@/shared/api/http";
import { buildApiUrl } from "@/shared/api/apiBase";

const NUTRITION_API_ENDPOINT = buildApiUrl("/api/v1/nutrition");
const MAX_LIMIT = 100;
const MAX_SEARCH_LENGTH = 100;
const MAX_NOTES_LENGTH = 1000;
const MAX_MEAL_NAME_LENGTH = 255;

function getNutritionErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return error?.data?.message || "Not authorized. Please log out and log in again.";
  }

  return error?.data?.message || error?.message || fallbackMessage;
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function roundMacro(value) {
  return Math.max(0, Math.round(toNumber(value)));
}

function boundedInteger(value, fieldName, min, max) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}.`);
  }
  return number;
}

function optionalBoundedInteger(value, fieldName, min, max) {
  if (value === undefined || value === null || String(value).trim() === "") return undefined;
  return boundedInteger(value, fieldName, min, max);
}

function boundedText(value, fieldName, min, max) {
  const normalized = String(value ?? "").trim();
  if (normalized.length < min || normalized.length > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max} characters.`);
  }
  return normalized;
}

function optionalText(value, fieldName, max) {
  const normalized = String(value ?? "").trim();
  if (normalized.length > max) {
    throw new Error(`${fieldName} cannot be longer than ${max} characters.`);
  }
  return normalized;
}

function languageCode(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return undefined;
  if (!/^[a-zA-Z]{2}$/.test(normalized)) {
    throw new Error("Language must be a two-letter code.");
  }
  return normalized.toLowerCase();
}

function validateFoodSearchParams(query, { limit = 10, offset = 0, lang = "en" } = {}) {
  return {
    q: boundedText(query, "Search query", 2, MAX_SEARCH_LENGTH),
    limit: optionalBoundedInteger(limit, "Limit", 1, MAX_LIMIT) ?? 10,
    offset: optionalBoundedInteger(offset, "Offset", 0, Number.MAX_SAFE_INTEGER) ?? 0,
    lang: languageCode(lang) || "en",
  };
}

function validateNutritionPayload(formState) {
  return {
    mealName: boundedText(formState.mealName, "Meal name", 2, MAX_MEAL_NAME_LENGTH),
    mealDate: boundedText(formState.mealDate, "Meal date", 1, 20),
    calories: boundedInteger(roundMacro(formState.calories), "Calories", 1, 10000),
    proteinGrams: boundedInteger(roundMacro(formState.proteinGrams), "Protein", 0, 1000),
    carbsGrams: boundedInteger(roundMacro(formState.carbsGrams), "Carbs", 0, 1000),
    fatGrams: boundedInteger(roundMacro(formState.fatGrams), "Fat", 0, 1000),
    notes: optionalText(formState.notes, "Notes", MAX_NOTES_LENGTH),
    category: formState.category,
  };
}

export function normalizeNutritionEntry(entry = {}) {
  const id = entry.nutritionId || entry.id;

  return {
    id,
    nutritionId: id,
    mealName: entry.mealName || entry.name || "Untitled food",
    mealDate: entry.mealDate || entry.date || "",
    calories: roundMacro(entry.calories),
    proteinGrams: roundMacro(entry.proteinGrams),
    carbsGrams: roundMacro(entry.carbsGrams),
    fatGrams: roundMacro(entry.fatGrams),
    notes: entry.notes || "",
    category: entry.category || "GENERAL",
    createdAt: entry.createdAt || "",
    updatedAt: entry.updatedAt || "",
  };
}

export function normalizeFoodProduct(product = {}) {
  const name = product.product_name || product.productName || "Unnamed product";
  const caloriesPer100g = toNumber(product.calories_per_100g ?? product.caloriesPer100g);
  const servingCalories = toNumber(product.calories_per_serving ?? product.caloriesPerServing);

  return {
    code: product.code || "",
    name,
    caloriesPer100g,
    caloriesPerServing: servingCalories,
    proteinPer100g: toNumber(product.protein_per_100g ?? product.proteinPer100g),
    carbsPer100g: toNumber(product.carbs_per_100g ?? product.carbsPer100g),
    fatPer100g: toNumber(product.fat_per_100g ?? product.fatPer100g),
    sugarPer100g: toNumber(product.sugar_per_100g ?? product.sugarPer100g),
    servingSize: product.serving_size || product.servingSize || "",
    brands: Array.isArray(product.brands) ? product.brands : [],
    categories: Array.isArray(product.categories) ? product.categories : [],
    imageUrl: product.image_small_url || product.imageSmallUrl || product.image_url || product.imageUrl || "",
  };
}

export async function fetchNutritionEntries() {
  try {
    const payload = await fetchAuthenticatedJson(NUTRITION_API_ENDPOINT, { method: "GET" });
    const entries = Array.isArray(payload) ? payload : payload?.data || payload?.entries || [];
    return entries.map(normalizeNutritionEntry);
  } catch (error) {
    throw new Error(getNutritionErrorMessage(error, "Failed to load nutrition entries."));
  }
}

export async function searchFoodProducts(query, { limit = 10, offset = 0, lang = "en" } = {}) {
  const validParams = validateFoodSearchParams(query, { limit, offset, lang });
  const params = new URLSearchParams({
    q: validParams.q,
    limit: String(validParams.limit),
    offset: String(validParams.offset),
    lang: validParams.lang,
    hasNutrition: "true",
  });

  try {
    const payload = await fetchAuthenticatedJson(`${NUTRITION_API_ENDPOINT}/foods/search?${params.toString()}`, {
      method: "GET",
    });

    const results = Array.isArray(payload?.results) ? payload.results : [];
    return {
      results: results.map(normalizeFoodProduct),
      count: payload?.count ?? results.length,
      total: payload?.total ?? results.length,
    };
  } catch (error) {
    throw new Error(getNutritionErrorMessage(error, "Could not search foods."));
  }
}

function buildNutritionPayload(formState) {
  return validateNutritionPayload(formState);
}

export async function createNutritionEntry(formState) {
  try {
    const data = await fetchAuthenticatedJson(NUTRITION_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildNutritionPayload(formState)),
    });

    return normalizeNutritionEntry(data?.nutrition || data?.data || data);
  } catch (error) {
    throw new Error(getNutritionErrorMessage(error, "Could not save nutrition entry."));
  }
}

export async function updateNutritionEntry(entryId, formState) {
  try {
    const data = await fetchAuthenticatedJson(`${NUTRITION_API_ENDPOINT}/${entryId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildNutritionPayload(formState)),
    });

    return normalizeNutritionEntry(data?.nutrition || data?.data || data);
  } catch (error) {
    throw new Error(getNutritionErrorMessage(error, "Could not update nutrition entry."));
  }
}

export async function deleteNutritionEntry(entryId) {
  try {
    await fetchAuthenticatedJson(`${NUTRITION_API_ENDPOINT}/${entryId}`, { method: "DELETE" });
  } catch (error) {
    throw new Error(getNutritionErrorMessage(error, "Could not delete nutrition entry."));
  }
}
