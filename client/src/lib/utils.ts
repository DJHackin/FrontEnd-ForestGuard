import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime(); // ms
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const h   = Math.floor(min / 60);
  const day = Math.floor(h / 24);

  if (day > 0)  return `${day} j`;
  if (h > 0)    return `${h} h`;
  if (min > 0)  return `${min} min`;
  return `à l’instant`;
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function getDateLabel(date: Date | string): string {
  const d   = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString())      return "Aujourd’hui";
  if (d.toDateString() === yesterday.toDateString())  return "Hier";
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
}