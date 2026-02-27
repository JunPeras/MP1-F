export const ACTIVITY_TYPES = [
  'examen',
  'quiz',
  'taller',
  'proyecto',
  'otro',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** Readable labels for UI display */
export const ACTIVITY_TYPE_LABEL: Record<ActivityType, string> = {
  examen: 'Examen',
  quiz: 'Quiz',
  taller: 'Taller',
  proyecto: 'Proyecto',
  otro: 'Otro',
};
