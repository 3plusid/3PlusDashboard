import { ProjectStatus } from '../types';

/**
 * Format number to Indonesian Rupiah currency string
 * Example: 24500000000 -> "Rp 24.500.000.000"
 */
export function formatIDR(amount: number, compact: boolean = false): string {
  if (compact) {
    if (amount >= 1_000_000_000_000) {
      return `Rp ${(amount / 1_000_000_000_000).toFixed(1)} Triliun`;
    }
    if (amount >= 1_000_000_000) {
      return `Rp ${(amount / 1_000_000_000).toFixed(1)} Miliar`;
    }
    if (amount >= 1_000_000) {
      return `Rp ${(amount / 1_000_000).toFixed(1)} Juta`;
    }
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Format ISO date string (YYYY-MM-DD) to Indonesian formatted date
 * Example: "2026-01-15" -> "15 Jan 2026"
 */
export function formatDateID(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Get visual configuration for project status badge
 */
export function getStatusBadge(status: ProjectStatus) {
  switch (status) {
    case 'prospek':
      return {
        label: 'Prospek',
        bgColor: 'bg-amber-100 text-amber-800 border-amber-200',
        dotColor: 'bg-amber-500',
        markerHex: '#F59E0B',
        accentBg: 'bg-amber-50 shadow-amber-500/10'
      };
    case 'on_going':
      return {
        label: 'On Going',
        bgColor: 'bg-blue-100 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-600',
        markerHex: '#2563EB',
        accentBg: 'bg-blue-50 shadow-blue-500/10'
      };
    case 'bast':
      return {
        label: 'BAST',
        bgColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dotColor: 'bg-emerald-500',
        markerHex: '#10B981',
        accentBg: 'bg-emerald-50 shadow-emerald-500/10'
      };
  }
}

/**
 * Calculate deadline status
 * Returns: 'overdue' (terlambat), 'approaching' (<30 hari), 'normal', or 'completed'
 */
export function getDeadlineStatus(targetEndDate: string, status: ProjectStatus) {
  if (status === 'bast') {
    return { type: 'completed', label: 'Telah BAST', color: 'text-emerald-700 bg-emerald-50' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetEndDate);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      type: 'overdue',
      label: `Terlambat ${Math.abs(diffDays)} Hari`,
      days: diffDays,
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      dotColor: 'bg-red-600'
    };
  } else if (diffDays <= 30) {
    return {
      type: 'approaching',
      label: `Tenggat ${diffDays} Hari Lagi`,
      days: diffDays,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500'
    };
  }

  return {
    type: 'normal',
    label: `Sisa ${diffDays} Hari`,
    days: diffDays,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    dotColor: 'bg-slate-400'
  };
}
