"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import AppPageShell from "@/shared/components/AppPageShell";
import StatusMessage from "@/shared/components/StatusMessage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  fetchExerciseLibraryItem,
  fetchExerciseLibraryReferences,
  searchExerciseLibrary,
} from "@/features/library/api/exerciseLibraryApi";

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function joinNames(items = []) {
  return items.map((item) => item.nameEn || item.name).filter(Boolean).join(", ");
}

const PAGE_SIZE = 100;

const MUSCLE_GROUPS = [
  {
    id: "chest",
    label: "Chest",
    keywords: ["chest", "pectoralis"],
  },
  {
    id: "back",
    label: "Back",
    keywords: ["back", "latissimus", "trapezius", "erector"],
  },
  {
    id: "legs",
    label: "Legs",
    keywords: ["quad", "femoris", "hamstring", "glute", "calf", "gastrocnemius", "soleus", "leg", "adductor", "abductor"],
  },
  {
    id: "shoulders",
    label: "Shoulders",
    keywords: ["shoulder", "deltoid"],
  },
  {
    id: "arms",
    label: "Arms",
    keywords: ["biceps brachii", "triceps brachii", "brachialis", "forearm", "arm"],
  },
  {
    id: "core",
    label: "Core",
    keywords: ["abdominis", "oblique", "obliquus", "rectus", "core"],
  },
];

function getMuscleLabel(muscle = {}) {
  return muscle.nameEn || muscle.name || `Muscle ${muscle.id}`;
}

function getMuscleSearchText(muscle = {}) {
  return `${muscle.name || ""} ${muscle.nameEn || ""}`.toLowerCase();
}

function getMusclesForGroup(muscles = [], group) {
  return muscles.filter((muscle) => {
    const searchText = getMuscleSearchText(muscle);
    return group.keywords.some((keyword) => searchText.includes(keyword));
  });
}

function MuscleGroupPicker({
  muscles,
  selectedMuscleId,
  expandedGroupId,
  onExpandedGroupChange,
  onMuscleSelect,
  onClearMuscle,
  disabled,
}) {
  const groups = MUSCLE_GROUPS.map((group) => ({
    ...group,
    muscles: getMusclesForGroup(muscles, group),
  })).filter((group) => group.muscles.length > 0);

  const selectedMuscle = muscles.find((muscle) => String(muscle.id) === String(selectedMuscleId));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Choose a muscle group</p>
          {selectedMuscle ? (
            <p className="mt-1 text-sm text-primary">Showing {getMuscleLabel(selectedMuscle)}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Start broad, then pick the exact muscle.</p>
          )}
        </div>
        {selectedMuscleId ? (
          <Button
            type="button"
            onClick={onClearMuscle}
            variant="secondary"
            size="sm"
          >
            All
          </Button>
        ) : null}
      </div>

      {disabled ? <StatusMessage>Loading muscle groups...</StatusMessage> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const isExpanded = expandedGroupId === group.id;
          const isActive = group.muscles.some((muscle) => String(muscle.id) === String(selectedMuscleId));

          return (
            <Button
              key={group.id}
              type="button"
              data-cy="library-muscle-group"
              data-group-id={group.id}
              onClick={() => onExpandedGroupChange(isExpanded ? "" : group.id)}
              disabled={disabled}
              variant="secondary"
              className={`min-h-32 rounded-xl border p-5 text-left transition-colors disabled:opacity-60 ${
                isActive || isExpanded
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted"
              }`}
            >
              <span className="block text-xl font-black">{group.label}</span>
            </Button>
          );
        })}
      </div>

      {expandedGroupId ? (
        <Card className="border-primary/10 bg-card py-3">
          <CardContent className="px-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {(groups.find((group) => group.id === expandedGroupId)?.muscles || []).map((muscle) => {
              const isActive = String(muscle.id) === String(selectedMuscleId);

              return (
                <Button
                  key={muscle.id}
                  type="button"
                  data-cy="library-muscle-option"
                  data-muscle-id={muscle.id}
                  onClick={() => onMuscleSelect(String(muscle.id))}
                  size="sm"
                  variant={isActive ? "default" : "secondary"}
                  className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-background"
                      : "border-border text-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {getMuscleLabel(muscle)}
                </Button>
              );
            })}
          </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function ExerciseCard({ exercise, isSelected, onSelect }) {
  const muscles = joinNames(exercise.muscles);

  return (
    <button
      type="button"
      data-cy="library-exercise-card"
      data-exercise-id={exercise.id}
      onClick={() => onSelect(exercise)}
      className={`group flex min-h-[260px] w-full flex-col overflow-hidden rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 ${
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
      }`}
    >
      <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden border-b border-primary/10 bg-primary/5">
        {exercise.mainImage ? (
          <Image
            src={exercise.mainImage}
            alt=""
            width={360}
            height={270}
            unoptimized
            className="h-full w-full object-contain p-3 transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="text-3xl font-black text-primary/50">
            {(exercise.name || "E").slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <span className="inline-flex rounded-md border border-primary/20 bg-primary/5 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-primary/80">
            {exercise.category?.name || "Exercise"}
          </span>
        </div>
        <h3 className="line-clamp-2 text-base font-black leading-snug text-foreground">
          {exercise.name || `Exercise ${exercise.id}`}
        </h3>
        {muscles ? (
          <p className="mt-auto line-clamp-1 pt-4 text-sm text-muted-foreground">
            {muscles}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function ExerciseDetail({ exercise }) {
  if (!exercise) {
    return null;
  }

  const description = stripHtml(exercise.description);
  const muscles = joinNames(exercise.muscles);
  const secondaryMuscles = joinNames(exercise.secondaryMuscles);
  const equipment = joinNames(exercise.equipment);
  const aliases = (exercise.aliases || []).join(", ");
  const mainVideo = exercise.videos.find((video) => video.isMain)?.video || exercise.videos[0]?.video || "";
  const galleryImages = exercise.images || [];
  const videos = exercise.videos || [];
  const licenseLabel = [exercise.license?.shortName, exercise.licenseAuthor].filter(Boolean).join(" - ");

  return (
    <Card className="border-primary/10 bg-card py-5">
      <CardContent className="px-5">
      <div className="overflow-hidden rounded-xl border border-primary/10 bg-primary/5">
        {exercise.mainImage ? (
          <Image
            src={exercise.mainImage}
            alt=""
            width={720}
            height={360}
            unoptimized
            className="max-h-80 w-full object-contain"
          />
        ) : (
          <div className="grid min-h-48 place-items-center text-primary/60">
            <span className="material-icons text-5xl">fitness_center</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
          {exercise.category?.name || "Exercise"}
        </p>
        <h2 className="mt-2 text-2xl font-bold">{exercise.name || `Exercise ${exercise.id}`}</h2>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {muscles ? (
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Primary muscles</p>
            <p className="mt-1 text-sm">{muscles}</p>
          </div>
        ) : null}
        {secondaryMuscles ? (
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Secondary muscles</p>
            <p className="mt-1 text-sm">{secondaryMuscles}</p>
          </div>
        ) : null}
        {equipment ? (
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Equipment</p>
            <p className="mt-1 text-sm">{equipment}</p>
          </div>
        ) : null}
        {aliases ? (
          <div className="rounded-lg border border-primary/10 bg-primary/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Aliases</p>
            <p className="mt-1 text-sm">{aliases}</p>
          </div>
        ) : null}
      </div>

      {description ? <p className="mt-5 text-sm leading-7 text-slate-300">{description}</p> : null}

      {mainVideo ? (
        <Button
          asChild
          variant="secondary"
          className="mt-5"
        >
        <a
          href={mainVideo}
          target="_blank"
          rel="noreferrer"
        >
          Open Video
        </a>
        </Button>
      ) : null}

      {galleryImages.length > 1 ? (
        <div className="mt-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary/60">Images</h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryImages.map((image) => (
              <Button
                asChild
                key={image.id || image.image}
                variant="secondary"
                className="grid aspect-square h-auto place-items-center overflow-hidden rounded-lg border border-primary/10 bg-primary/5 p-0"
              >
              <a href={image.image} target="_blank" rel="noreferrer">
                <Image
                  src={image.image}
                  alt=""
                  width={180}
                  height={180}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </a>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {videos.length > 1 ? (
        <div className="mt-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary/60">Videos</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {videos.map((video, index) => (
              <Button
                asChild
                key={video.id || video.video}
                variant="secondary"
                size="sm"
              >
              <a href={video.video} target="_blank" rel="noreferrer">
                Video {index + 1}{video.duration ? ` - ${video.duration}` : ""}
              </a>
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {licenseLabel ? (
        <div className="mt-5 rounded-lg border border-primary/10 bg-primary/5 p-3 text-xs text-primary/70">
          <span className="font-bold uppercase tracking-wider">License</span>
          <p className="mt-1">
            {exercise.license?.url ? (
              <a href={exercise.license.url} target="_blank" rel="noreferrer" className="underline decoration-primary/40">
                {licenseLabel}
              </a>
            ) : (
              licenseLabel
            )}
          </p>
        </div>
      ) : null}
      </CardContent>
    </Card>
  );
}

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ muscleId: "" });
  const [expandedMuscleGroupId, setExpandedMuscleGroupId] = useState("");
  const [references, setReferences] = useState({ muscles: [] });
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [resultMeta, setResultMeta] = useState({ count: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [error, setError] = useState("");
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReferences() {
      setIsLoadingFilters(true);
      try {
        const muscles = await fetchExerciseLibraryReferences("muscles");
        if (!isMounted) return;
        setReferences({ muscles });
      } catch {
        if (isMounted) setReferences({ muscles: [] });
      } finally {
        if (isMounted) setIsLoadingFilters(false);
      }
    }

    loadReferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timeoutId = window.setTimeout(async () => {
      if (!filters.muscleId) {
        setExercises([]);
        setSelectedExercise(null);
        setResultMeta({ count: 0, total: 0 });
        setError("");
        setDetailError("");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const payload = await searchExerciseLibrary({
          q: query,
          limit: PAGE_SIZE,
          offset: 0,
          muscleId: filters.muscleId,
        });
        if (!isMounted) return;
        setExercises(payload.results);
        setResultMeta({ count: payload.count, total: payload.total });
        setDetailError("");
        setSelectedExercise((current) =>
          current && payload.results.some((exercise) => exercise.id === current.id) ? current : null
        );
      } catch (loadError) {
        if (!isMounted) return;
        setExercises([]);
        setSelectedExercise(null);
        setResultMeta({ count: 0, total: 0 });
        setDetailError("");
        setError(loadError.message || "Could not load exercise library.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [query, filters]);

  useEffect(() => {
    if (!selectedExercise?.id) {
      return;
    }

    let isMounted = true;

    async function loadExerciseDetail() {
      setIsLoadingDetail(true);
      setDetailError("");

      try {
        const exercise = await fetchExerciseLibraryItem(selectedExercise.id);
        if (isMounted) setSelectedExercise(exercise);
      } catch (loadError) {
        if (isMounted) setDetailError(loadError.message || "Could not load exercise details.");
      } finally {
        if (isMounted) setIsLoadingDetail(false);
      }
    }

    loadExerciseDetail();

    return () => {
      isMounted = false;
    };
  }, [selectedExercise?.id]);

  const selectedId = selectedExercise?.id;
  const hasMuscleSelected = Boolean(filters.muscleId);
  const hasFilters = Boolean(query || filters.muscleId);
  const hasMore = exercises.length < resultMeta.total;
  const resultLabel = useMemo(() => {
    if (isLoading) return "Loading";
    if (!resultMeta.count) return "No results";
    return `${resultMeta.count} shown${resultMeta.total ? ` of ${resultMeta.total}` : ""}`;
  }, [isLoading, resultMeta]);

  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
    setSelectedExercise(null);
  };

  const resetFilters = () => {
    setQuery("");
    setExpandedMuscleGroupId("");
    setFilters({ muscleId: "" });
    setSelectedExercise(null);
  };

  const loadMore = async () => {
    setIsLoadingMore(true);
    setError("");

    try {
      const payload = await searchExerciseLibrary({
        q: query,
        limit: PAGE_SIZE,
        offset: exercises.length,
        muscleId: filters.muscleId,
      });
      setExercises((current) => [...current, ...payload.results]);
      setResultMeta({ count: exercises.length + payload.results.length, total: payload.total });
    } catch (loadError) {
      setError(loadError.message || "Could not load more exercises.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <AppPageShell mainClassName="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-primary/10 bg-background-light/80 px-4 py-5 backdrop-blur-md sm:px-6 lg:px-8 dark:bg-background-dark/80">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">
          Exercise Library
        </p>
        <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exercise Library</h1>
            <p className="mt-1 text-sm text-primary/60">Browse exercises from the backend library controller.</p>
          </div>
          <Badge>{resultLabel}</Badge>
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        {!hasMuscleSelected ? (
          <Card className="mx-auto max-w-6xl border-primary/10 bg-card py-5">
            <CardContent className="px-5">
              <MuscleGroupPicker
                muscles={references.muscles}
                selectedMuscleId={filters.muscleId}
                expandedGroupId={expandedMuscleGroupId}
                onExpandedGroupChange={setExpandedMuscleGroupId}
                onMuscleSelect={(muscleId) => updateFilter("muscleId", muscleId)}
                onClearMuscle={() => updateFilter("muscleId", "")}
                disabled={isLoadingFilters}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            <Card className="border-primary/10 bg-card py-4">
              <CardContent className="flex flex-col gap-4 px-4 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary/60">Selected muscle</p>
                  <h2 className="mt-1 truncate text-2xl font-black">
                    {getMuscleLabel(references.muscles.find((muscle) => String(muscle.id) === String(filters.muscleId)))}
                  </h2>
                </div>

                <div className="flex flex-col gap-3 md:w-[420px] md:flex-row md:items-end">
                  <label className="block flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/60">Search within this muscle</span>
                    <Input
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setSelectedExercise(null);
                      }}
                      className="mt-2"
                      type="search"
                    />
                  </label>

                  <Button type="button" onClick={resetFilters} variant="secondary" className="md:mb-0.5">
                    Change Muscle
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,440px)]">
              <section className="space-y-4">
                {isLoading ? <StatusMessage>Loading exercise library...</StatusMessage> : null}
                {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
                {!isLoading && !error && exercises.length === 0 ? (
                  <StatusMessage>No exercises matched this muscle.</StatusMessage>
                ) : null}
                {!isLoading && !error && exercises.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                    {exercises.map((exercise) => (
                      <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        isSelected={selectedId === exercise.id}
                        onSelect={setSelectedExercise}
                      />
                    ))}
                  </div>
                ) : null}
                {!isLoading && !error && hasMore ? (
                  <Button
                    type="button"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    variant="secondary"
                    className="w-full"
                  >
                    {isLoadingMore ? "Loading..." : "Load More"}
                  </Button>
                ) : null}
              </section>

              <section className="xl:sticky xl:top-28 xl:self-start">
                {isLoadingDetail ? <StatusMessage className="mb-3">Loading exercise details...</StatusMessage> : null}
                {detailError ? <StatusMessage tone="error" className="mb-3">{detailError}</StatusMessage> : null}
                {selectedExercise ? <ExerciseDetail exercise={selectedExercise} /> : null}
              </section>
            </div>
          </div>
        )}
      </div>
    </AppPageShell>
  );
}
