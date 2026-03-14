import { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, Loader2, Save } from 'lucide-react';
import axios from 'axios';

import { Modal } from './Modal';
import { checkLimitConflicts, updateProfile } from '../../services/auth.service';

interface Conflict {
  date: string;
  scheduled_hours: number;
  proposed_limit: number;
}

interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/**
 * Modal for updating user settings (daily hour limit).
 * Checks for conflicts with already-scheduled subtasks before saving.
 */
export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const user = JSON.parse(localStorage.getItem('user') ?? '{}');
  const currentLimit = user?.daily_hour_limit ?? 6;

  const [dailyHourLimit, setDailyHourLimit] = useState<number>(currentLimit);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasConflicts = conflicts.length > 0;
  const isDirty = dailyHourLimit !== Number(currentLimit);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const freshUser = JSON.parse(localStorage.getItem('user') ?? '{}');
      const freshLimit = Number(freshUser?.daily_hour_limit ?? 6);
      setDailyHourLimit(freshLimit);
      setConflicts([]);
      setError(null);
    }
  }, [isOpen]);

  // Debounced conflict check when limit changes
  const checkConflicts = useCallback(async (limit: number) => {
    if (limit < 1 || limit > 16) return;

    setIsChecking(true);
    setError(null);
    setConflicts([]);

    try {
      const data = await checkLimitConflicts(limit);
      setConflicts(data.conflicts ?? []);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setConflicts(err.response.data.conflicts ?? []);
      } else {
        setError('Error al verificar conflictos.');
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !isDirty) {
      setConflicts([]);
      return;
    }

    const timeout = setTimeout(() => {
      checkConflicts(dailyHourLimit);
    }, 400);

    return () => clearTimeout(timeout);
  }, [dailyHourLimit, isOpen, isDirty, checkConflicts]);

  const handleSave = async () => {
    if (hasConflicts || !isDirty) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateProfile({ daily_hour_limit: dailyHourLimit });
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data;
        const msg =
          data.daily_hour_limit?.[0] ??
          data.error ??
          'Error al guardar los cambios.';
        setError(msg);
      } else {
        setError('Error al guardar los cambios.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuracion"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isDirty || hasConflicts || isChecking}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Daily hour limit */}
        <div>
          <label
            htmlFor="settings-daily-limit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Limite de horas diarias
          </label>
          <input
            id="settings-daily-limit"
            type="number"
            step="0.5"
            min="1"
            max="16"
            value={dailyHourLimit}
            onChange={(e) => setDailyHourLimit(Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Maximo de horas que puedes planificar por dia (entre 1 y 16).
          </p>
        </div>

        {/* Loading indicator while checking */}
        {isChecking && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verificando conflictos...
          </div>
        )}

        {/* Conflict banner */}
        {hasConflicts && (
          <div className="flex gap-3 rounded-md bg-red-50 p-3 border border-red-100">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <p className="font-bold uppercase mb-1">
                No se puede aplicar este limite
              </p>
              <p className="mb-2">
                Los siguientes dias ya tienen subtareas planificadas que exceden
                el nuevo limite de <strong>{dailyHourLimit}h</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                {conflicts.map((c) => (
                  <li key={c.date}>
                    <strong>{c.date}</strong> — {c.scheduled_hours}h
                    planificadas
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Reduce las horas de esos dias antes de cambiar el limite.
              </p>
            </div>
          </div>
        )}

        {/* General error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </Modal>
  );
}
