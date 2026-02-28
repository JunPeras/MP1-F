import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha usando date-fns para mayor robustez y amigabilidad.
 * @param dateStr String de fecha en formato ISO (ej. 2026-02-27T10:00:00Z)
 * @param includeTime Si es true, incluye la hora en el formato
 * @returns String formateado en español o 'No definida'/'Error en fecha'
 */
export function formatFriendlyDate(dateStr: string | null | undefined, includeTime = false) {
  if (!dateStr) return 'No definida';

  try {
    console.log("Formatting date:", dateStr, "Include time:", includeTime);
    const date = parseISO(dateStr);

    if (includeTime) {
      // Ejemplo: 27 de febrero, 2026 - 10:00 am
      return format(date, "d 'de' MMMM, yyyy - hh:mm a", { locale: es });
    }

    // Ejemplo: viernes, 27 de febrero de 2026
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Error en fecha';
  }
}
