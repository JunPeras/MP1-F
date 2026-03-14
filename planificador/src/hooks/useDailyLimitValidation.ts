import { useMemo } from 'react';

export interface Subtask {
  id?: number;
  activity: number;
  activity_title?: string;
  name: string;
  target_date: string;
  estimated_hours: string | number;
  completed: boolean;
}

interface ConflictActivity {
  id: number;
  title: string;
  hours: number;
}

/**
 * Hook para calcular la carga de horas y detectar conflictos de límite diario.
 * Centraliza la lógica de filtrado y agregación para evitar repetición de código.
 */
export function useDailyLimitValidation(
  allSubtasks: Subtask[],
  targetDate: string,
  currentSubtaskId?: number,
  currentActivityId?: number,
  hoursToRegister: number = 0
) {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const limit = user?.daily_hour_limit ?? 6;

  return useMemo(() => {
    if (!targetDate) {
      return { hasExceeded: false, totalHours: 0, limit, conflictingActivities: [], hoursInCurrentActivity: 0 };
    }

    // 1. Filtrar subtareas del mismo día que NO estén completadas
    const daySubtasks = allSubtasks.filter(
      (s) => s.target_date === targetDate && !s.completed && s.id !== currentSubtaskId
    );

    // 2. Calcular horas en la actividad actual
    const hoursInCurrentActivity = daySubtasks
      .filter((s) => s.activity === currentActivityId)
      .reduce((sum, s) => sum + Number(s.estimated_hours), 0);

    // 3. Agrupar conflictos por otras actividades
    const conflictingActivities = daySubtasks
      .filter((s) => s.activity !== currentActivityId)
      .reduce((acc: ConflictActivity[], s) => {
        const existing = acc.find((a) => a.id === s.activity);
        if (existing) {
          existing.hours += Number(s.estimated_hours);
        } else {
          acc.push({
            id: s.activity,
            title: s.activity_title || 'Otra actividad',
            hours: Number(s.estimated_hours),
          });
        }
        return acc;
      }, []);

    const totalHoursBefore = daySubtasks.reduce((sum, s) => sum + Number(s.estimated_hours), 0);
    const totalHours = Number((totalHoursBefore + hoursToRegister).toFixed(1));
    const hasExceeded = totalHours > limit;

    return {
      hasExceeded,
      totalHours,
      limit,
      conflictingActivities,
      hoursInCurrentActivity,
    };
  }, [allSubtasks, targetDate, currentSubtaskId, currentActivityId, hoursToRegister, limit]);
}
