"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';

const EXERCISE_LIBRARY = [
    { id: 'bench-press', name: 'Barbell Bench Press', focus: 'Chest', equipment: 'Barbell' },
    { id: 'incline-db-press', name: 'Incline Dumbbell Press', focus: 'Chest', equipment: 'Dumbbells' },
    { id: 'lat-pulldown', name: 'Lat Pulldown', focus: 'Back', equipment: 'Cable' },
    { id: 'barbell-row', name: 'Barbell Row', focus: 'Back', equipment: 'Barbell' },
    { id: 'overhead-press', name: 'Overhead Press', focus: 'Shoulders', equipment: 'Barbell' },
    { id: 'lateral-raise', name: 'Dumbbell Lateral Raise', focus: 'Shoulders', equipment: 'Dumbbells' },
    { id: 'back-squat', name: 'Back Squat', focus: 'Legs', equipment: 'Barbell' },
    { id: 'romanian-deadlift', name: 'Romanian Deadlift', focus: 'Hamstrings', equipment: 'Barbell' },
    { id: 'walking-lunge', name: 'Walking Lunge', focus: 'Legs', equipment: 'Dumbbells' },
    { id: 'plank-hold', name: 'Plank Hold', focus: 'Core', equipment: 'Bodyweight' },
    { id: 'hanging-knee-raise', name: 'Hanging Knee Raise', focus: 'Core', equipment: 'Pull-up Bar' },
    { id: 'triceps-pushdown', name: 'Triceps Pushdown', focus: 'Arms', equipment: 'Cable' },
];

const WORKOUTS_API_ENDPOINT = '/api/user/workouts';
const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

const readTokenFromCookie = () => {
    if (typeof document === 'undefined') return '';
    const tokenCookie = document.cookie
        .split(';')
        .map((part) => part.trim())
        .find((part) =>
            part.startsWith('token=') ||
            part.startsWith('authToken=') ||
            part.startsWith('jwt=') ||
            part.startsWith('accessToken='),
        );

    if (!tokenCookie) return '';
    const [, value = ''] = tokenCookie.split('=');
    return decodeURIComponent(value);
};

const getAuthHeader = () => {
    if (typeof window === 'undefined') return {};
    const token =
        window.localStorage.getItem('authToken') ||
        window.localStorage.getItem('token') ||
        readTokenFromCookie();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeWorkout = (workout) => {
    const exercises = Array.isArray(workout?.exercises)
        ? workout.exercises.map((exercise, index) => {
            if (typeof exercise === 'string') {
                return {
                    id: `${exercise}-${index}`,
                    name: exercise,
                    focus: '',
                    equipment: '',
                };
            }

            return {
                id: exercise?.id || exercise?._id || `${exercise?.name || 'exercise'}-${index}`,
                name: exercise?.name || `Exercise ${index + 1}`,
                focus: exercise?.focus || '',
                equipment: exercise?.equipment || '',
            };
        })
        : [];

    return {
        id: workout?.id || workout?._id || `${Date.now()}-${Math.random()}`,
        title: workout?.title || workout?.name || workout?.workoutTitle || 'Untitled Workout',
        goal: workout?.goal || workout?.primaryGoal || '',
        date: workout?.date || workout?.scheduledDate || workout?.workoutDate || '',
        duration: String(workout?.duration || workout?.durationMinutes || 60),
        notes: workout?.notes || workout?.description || '',
        exercises,
        status: workout?.status || 'Scheduled',
    };
};

export default function WorkoutLogger() {
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExerciseIds, setSelectedExerciseIds] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formState, setFormState] = useState({
        title: '',
        goal: '',
        date: getTodayIsoDate(),
        duration: '60',
        notes: '',
    });

    const filteredExercises = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return EXERCISE_LIBRARY;
        return EXERCISE_LIBRARY.filter((exercise) => {
            const haystack = `${exercise.name} ${exercise.focus} ${exercise.equipment}`.toLowerCase();
            return haystack.includes(term);
        });
    }, [searchTerm]);

    const selectedExercises = useMemo(
        () => EXERCISE_LIBRARY.filter((exercise) => selectedExerciseIds.includes(exercise.id)),
        [selectedExerciseIds],
    );

    const handleToggleExercise = (id) => {
        setSelectedExerciseIds((current) =>
            current.includes(id)
                ? current.filter((exerciseId) => exerciseId !== id)
                : [...current, id],
        );
    };

    const resetComposer = () => {
        setFormState({ title: '', goal: '', date: getTodayIsoDate(), duration: '60', notes: '' });
        setSelectedExerciseIds([]);
        setSearchTerm('');
        setSubmitError('');
    };

    useEffect(() => {
        const loadWorkouts = async () => {
            setIsLoadingWorkouts(true);
            setLoadError('');

            try {
                const response = await fetch(WORKOUTS_API_ENDPOINT, {
                    method: 'GET',
                    headers: {
                        ...getAuthHeader(),
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error('Not authorized. Please log out and log in again.');
                    }
                    throw new Error('Failed to load workouts.');
                }

                const data = await response.json();
                const collection = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.workouts)
                        ? data.workouts
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];

                setWorkouts(collection.map((workout) => normalizeWorkout(workout)));
            } catch (error) {
                setLoadError(error?.message || 'Could not load workouts right now.');
            } finally {
                setIsLoadingWorkouts(false);
            }
        };

        loadWorkouts();
    }, []);

    const handleCreateWorkout = async (event) => {
        event.preventDefault();

        if (!formState.title.trim()) {
            setSubmitError('Workout title is required.');
            return;
        }

        if (!formState.date) {
            setSubmitError('Workout date is required.');
            return;
        }

        if (!Number(formState.duration) || Number(formState.duration) < 1) {
            setSubmitError('Duration must be at least 1 minute.');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        const payload = {
            name: formState.title.trim(),
            workoutDate: formState.date,
            durationMinutes: Number(formState.duration),
            notes: formState.notes.trim(),
        };

        try {
            const response = await fetch(WORKOUTS_API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let message = 'Could not save workout.';
                try {
                    const data = await response.json();
                    message = data?.message || message;
                } catch {
                    message = 'Could not save workout.';
                }
                if (response.status === 401 || response.status === 403) {
                    message = 'Not authorized. Please log out and log in again.';
                }

                throw new Error(message);
            }

            let createdWorkout = {
                ...payload,
                title: formState.title.trim(),
                goal: formState.goal.trim(),
                date: formState.date || null,
                duration: Number(formState.duration),
                status: 'Scheduled',
                exercises: selectedExercises.map((exercise) => ({
                    id: exercise.id,
                    name: exercise.name,
                    focus: exercise.focus,
                    equipment: exercise.equipment,
                })),
            };
            try {
                const data = await response.json();
                createdWorkout = data?.workout || data?.data || data;
            } catch {
                createdWorkout = payload;
            }

            setWorkouts((current) => [normalizeWorkout(createdWorkout), ...current]);
            resetComposer();
            setIsComposerOpen(false);
        } catch (error) {
            setSubmitError(error.message || 'Could not save workout.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const libraryPanel = (
        <>
            <div className="p-6 border-b border-slate-800/80">
                <h2 className="text-lg font-bold mb-4">Exercise Library</h2>
                <div className="relative mb-4">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                    <input
                        className="w-full bg-slate-800/70 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-primary focus:border-primary"
                        placeholder="Search exercises..."
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                </div>
                <p className="text-xs text-slate-400">
                    Tap an exercise to {isComposerOpen ? 'add it to this workout' : 'prepare your next workout'}.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                {filteredExercises.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">No matching exercises found.</div>
                ) : (
                    filteredExercises.map((exercise) => {
                        const isSelected = selectedExerciseIds.includes(exercise.id);
                        return (
                            <button
                                key={exercise.id}
                                type="button"
                                className={`w-full text-left p-4 rounded-xl border transition-colors ${
                                    isSelected
                                        ? 'bg-primary/10 border-primary/40 text-primary'
                                        : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-primary/30'
                                }`}
                                onClick={() => handleToggleExercise(exercise.id)}
                            >
                                <p className="font-semibold text-sm">{exercise.name}</p>
                                <p className="text-xs mt-1 text-slate-400">{exercise.focus} • {exercise.equipment}</p>
                            </button>
                        );
                    })
                )}
            </div>
        </>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden font-display">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="px-5 sm:px-8 py-5 border-b border-primary/10 bg-background-dark/30 backdrop-blur-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-primary/70 font-semibold mb-2">Workout Builder</p>
                            <h1 className="text-2xl font-bold tracking-tight">Plan a New Workout</h1>
                            <p className="text-slate-400 text-sm mt-1">Build your session, add exercises, then save it to your schedule.</p>
                        </div>

                        <button
                            type="button"
                            className="px-5 py-3 bg-primary text-background-dark font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
                            onClick={() => setIsComposerOpen(true)}
                        >
                            <span className="material-icons text-sm">add_circle</span>
                            Add New Workout
                        </button>
                    </div>
                </header>

                <section className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar pb-36">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {isComposerOpen && (
                            <form
                                className="bg-slate-900/60 border border-primary/20 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                                onSubmit={handleCreateWorkout}
                            >
                                <div className="md:col-span-2 flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-bold">New Workout Details</h2>
                                        <p className="text-sm text-slate-400 mt-1">Set your session details and pick your exercises.</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-9 h-9 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200"
                                        onClick={() => {
                                            setIsComposerOpen(false);
                                            resetComposer();
                                        }}
                                    >
                                        <span className="material-icons text-base">close</span>
                                    </button>
                                </div>

                                <label className="md:col-span-1">
                                    <span className="text-xs uppercase tracking-wide text-slate-400">Workout Title</span>
                                    <input
                                        required
                                        className="mt-2 w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        placeholder="Push Day - Heavy"
                                        value={formState.title}
                                        onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                                    />
                                </label>

                                <label className="md:col-span-1">
                                    <span className="text-xs uppercase tracking-wide text-slate-400">Primary Goal</span>
                                    <input
                                        className="mt-2 w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        placeholder="Strength / Hypertrophy"
                                        value={formState.goal}
                                        onChange={(event) => setFormState((current) => ({ ...current, goal: event.target.value }))}
                                    />
                                </label>

                                <label>
                                    <span className="text-xs uppercase tracking-wide text-slate-400">Workout Date</span>
                                    <input
                                        type="date"
                                        className="mt-2 w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        value={formState.date}
                                        onChange={(event) => setFormState((current) => ({ ...current, date: event.target.value }))}
                                    />
                                </label>

                                <label>
                                    <span className="text-xs uppercase tracking-wide text-slate-400">Duration (mins)</span>
                                    <input
                                        type="number"
                                        min="20"
                                        max="180"
                                        className="mt-2 w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        value={formState.duration}
                                        onChange={(event) => setFormState((current) => ({ ...current, duration: event.target.value }))}
                                    />
                                </label>

                                <label className="md:col-span-2">
                                    <span className="text-xs uppercase tracking-wide text-slate-400">Coaching Notes</span>
                                    <textarea
                                        rows="3"
                                        className="mt-2 w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary"
                                        placeholder="Start with activation warm-up and keep rest under 90 seconds."
                                        value={formState.notes}
                                        onChange={(event) => setFormState((current) => ({ ...current, notes: event.target.value }))}
                                    />
                                </label>

                                <div className="md:col-span-2 flex flex-wrap gap-2">
                                    {selectedExercises.length === 0 ? (
                                        <span className="text-xs text-slate-400">No exercises selected yet.</span>
                                    ) : (
                                        selectedExercises.map((exercise) => (
                                            <span
                                                key={exercise.id}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs"
                                            >
                                                {exercise.name}
                                            </span>
                                        ))
                                    )}
                                </div>

                                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-end mt-1">
                                    {submitError && (
                                        <p className="text-sm text-red-400 mr-auto">{submitError}</p>
                                    )}
                                    <button
                                        type="button"
                                        className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                                        onClick={resetComposer}
                                        disabled={isSubmitting}
                                    >
                                        Reset Form
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Workout'}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="bg-slate-900/30 border border-primary/10 rounded-2xl p-5 sm:p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold">Upcoming Workouts</h3>
                                <span className="text-xs uppercase tracking-widest text-slate-400">{workouts.length} scheduled</span>
                            </div>

                            {isLoadingWorkouts ? (
                                <div className="text-center max-w-md mx-auto py-8 text-slate-400 text-sm">Loading workouts...</div>
                            ) : loadError ? (
                                <div className="text-center max-w-md mx-auto py-8 text-red-400 text-sm">{loadError}</div>
                            ) : workouts.length === 0 ? (
                                <div className="text-center max-w-md mx-auto py-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <span className="material-icons text-3xl">event_available</span>
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">No Workouts Scheduled</h4>
                                    <p className="text-slate-400 text-sm">Open the builder and create your first workout plan for this week.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {workouts.map((workout) => (
                                        <article
                                            key={workout.id}
                                            className="p-4 rounded-xl border border-primary/15 bg-slate-950/40"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                <h4 className="font-bold text-base">{workout.title}</h4>
                                                <span className="text-[11px] uppercase tracking-widest px-2 py-1 rounded bg-primary/15 text-primary">
                                                    {workout.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-2">
                                                {workout.goal || 'No goal added'} • {workout.duration} mins • {workout.date || 'Date not set'}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {workout.exercises.length} exercises • {workout.notes || 'No notes'}
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="xl:hidden bg-slate-900 border border-primary/10 rounded-2xl flex flex-col min-h-96">
                            {libraryPanel}
                        </div>
                    </div>
                </section>

                <footer className="absolute bottom-0 left-0 right-0 xl:right-[320px] bg-background-dark/80 backdrop-blur-xl border-t border-primary/10 px-5 sm:px-8 py-4 flex justify-between items-center z-20">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500">Planner Status</p>
                        <p className="text-sm text-slate-300">{selectedExerciseIds.length} exercises selected</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-primary/20 rounded-lg text-primary hover:bg-primary/10"
                            onClick={() => setIsComposerOpen(true)}
                        >
                            Continue Editing
                        </button>
                    </div>
                </footer>
            </main>

            <aside className="w-80 bg-slate-900 border-l border-primary/10 hidden xl:flex flex-col h-screen z-20">
                {libraryPanel}
            </aside>
        </div>
    );
}
