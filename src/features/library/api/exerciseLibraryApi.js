import { buildApiUrl } from "@/shared/api/apiBase";
import { fetchAuthenticatedJson } from "@/shared/api/http";

const EXERCISE_LIBRARY_ENDPOINT = buildApiUrl("/api/v1/exercise-library");
const MAX_QUERY_LENGTH = 100;
const MAX_LIMIT = 100;

function getExerciseLibraryErrorMessage(error, fallbackMessage) {
  if (error?.status === 401 || error?.status === 403) {
    return error?.data?.message || "Not authorized. Please log out and log in again.";
  }

  return error?.data?.message || error?.message || fallbackMessage;
}

function optionalTrimmedText(value, fieldName, maxLength = MAX_QUERY_LENGTH) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "";
  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} cannot be longer than ${maxLength} characters.`);
  }
  return normalized;
}

function positiveInteger(value, fieldName, { required = false, min = 1, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (value === undefined || value === null || String(value).trim() === "") {
    if (required) throw new Error(`${fieldName} is required.`);
    return undefined;
  }

  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}.`);
  }
  return number;
}

function nonNegativeInteger(value, fieldName) {
  if (value === undefined || value === null || String(value).trim() === "") return undefined;

  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new Error(`${fieldName} must be at least 0.`);
  }
  return number;
}

function validateSearchParams(params = {}) {
  return {
    q: optionalTrimmedText(params.q, "Search query"),
    limit: positiveInteger(params.limit, "Limit", { max: MAX_LIMIT }),
    offset: nonNegativeInteger(params.offset, "Offset"),
    muscleId: positiveInteger(params.muscleId, "Muscle ID"),
    equipmentId: positiveInteger(params.equipmentId, "Equipment ID"),
    categoryId: positiveInteger(params.categoryId, "Category ID"),
  };
}

function validateReferenceParams(params = {}) {
  return {
    limit: positiveInteger(params.limit, "Limit", { max: MAX_LIMIT }),
    offset: nonNegativeInteger(params.offset, "Offset"),
  };
}

function validateExerciseId(exerciseId) {
  return positiveInteger(exerciseId, "Exercise ID", { required: true });
}

function normalizeReference(reference = null) {
  if (!reference) return null;

  return {
    id: reference.id,
    name: reference.name || "",
  };
}

function normalizeMuscle(muscle = {}) {
  return {
    id: muscle.id,
    name: muscle.name || "",
    nameEn: muscle.nameEn || muscle.name_en || "",
    isFront: muscle.isFront ?? muscle.is_front ?? null,
    imageUrlMain: muscle.imageUrlMain || muscle.image_url_main || "",
    imageUrlSecondary: muscle.imageUrlSecondary || muscle.image_url_secondary || "",
  };
}

function normalizeImage(image = {}) {
  return {
    id: image.id,
    image: image.image || "",
    isMain: image.isMain ?? image.is_main ?? false,
  };
}

function normalizeVideo(video = {}) {
  return {
    id: video.id,
    video: video.video || "",
    isMain: video.isMain ?? video.is_main ?? false,
    duration: video.duration || "",
  };
}

export function normalizeExerciseLibraryItem(item = {}) {
  const images = Array.isArray(item.images) ? item.images.map(normalizeImage).filter((image) => image.image) : [];
  const mainImage = images.find((image) => image.isMain)?.image || images[0]?.image || "";

  return {
    id: item.id,
    uuid: item.uuid || "",
    name: item.name || "",
    description: item.description || "",
    descriptionSource: item.descriptionSource || item.description_source || "",
    category: normalizeReference(item.category),
    muscles: Array.isArray(item.muscles) ? item.muscles.map(normalizeMuscle) : [],
    secondaryMuscles: Array.isArray(item.secondaryMuscles)
      ? item.secondaryMuscles.map(normalizeMuscle)
      : Array.isArray(item.secondary_muscles)
        ? item.secondary_muscles.map(normalizeMuscle)
        : [],
    equipment: Array.isArray(item.equipment) ? item.equipment.map(normalizeReference) : [],
    aliases: Array.isArray(item.aliases) ? item.aliases.filter(Boolean) : [],
    images,
    mainImage,
    videos: Array.isArray(item.videos) ? item.videos.map(normalizeVideo).filter((video) => video.video) : [],
    license: item.license
      ? {
          id: item.license.id,
          fullName: item.license.fullName || item.license.full_name || "",
          shortName: item.license.shortName || item.license.short_name || "",
          url: item.license.url || "",
        }
      : null,
    licenseAuthor: item.licenseAuthor || item.license_author || "",
  };
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value).trim());
    }
  });

  return query.toString();
}

export async function searchExerciseLibrary(params = {}) {
  const query = buildQuery(validateSearchParams({ limit: undefined, ...params }));

  try {
    const payload = await fetchAuthenticatedJson(
      `${EXERCISE_LIBRARY_ENDPOINT}/exercises/search${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
    const results = Array.isArray(payload?.results) ? payload.results : [];

    return {
      results: results.map(normalizeExerciseLibraryItem),
      count: payload?.count ?? results.length,
      total: payload?.total ?? results.length,
    };
  } catch (error) {
    throw new Error(getExerciseLibraryErrorMessage(error, "Could not load exercise library."));
  }
}

export async function fetchExerciseLibraryReferences(type, params = {}) {
  const query = buildQuery(validateReferenceParams({ limit: 100, ...params }));

  try {
    const payload = await fetchAuthenticatedJson(
      `${EXERCISE_LIBRARY_ENDPOINT}/${type}${query ? `?${query}` : ""}`,
      { method: "GET" }
    );

    return Array.isArray(payload)
      ? payload.map(type === "muscles" ? normalizeMuscle : normalizeReference)
      : [];
  } catch (error) {
    throw new Error(getExerciseLibraryErrorMessage(error, "Could not load exercise filters."));
  }
}

export async function fetchExerciseLibraryItem(exerciseId) {
  const validExerciseId = validateExerciseId(exerciseId);
  try {
    const payload = await fetchAuthenticatedJson(`${EXERCISE_LIBRARY_ENDPOINT}/exercises/${validExerciseId}`, {
      method: "GET",
    });

    return normalizeExerciseLibraryItem(payload);
  } catch (error) {
    throw new Error(getExerciseLibraryErrorMessage(error, "Could not load exercise details."));
  }
}
