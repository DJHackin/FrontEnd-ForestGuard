import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Flame, Video } from "lucide-react";
import type { SensorType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SensorFiltersProps {
  activeFilter: SensorType | 'all';
  onFilterChange: (filter: SensorType | 'all') => void;
  counts: Record<SensorType | 'all', number>;
}

const filters: { value: SensorType | 'all'; label: string; icon?: typeof Volume2 }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'sound', label: 'Sonore', icon: Volume2 },
  { value: 'smoke', label: 'Fumée', icon: Flame },
  { value: 'motion', label: 'Mouvement', icon: Video },
];

export function SensorFilters({ activeFilter, onFilterChange, counts }: SensorFiltersProps) {
  return (
    <div 
      className="flex items-center gap-2 flex-wrap" 
      role="group" 
      aria-label="Filtres par type de capteur"
      data-testid="sensor-filters"
    >
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const Icon = filter.icon;
        
        return (
          <Button
            key={filter.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              "gap-2 transition-all duration-200",
              isActive && "bg-[#3B82F6] border-[#3B82F6]"
            )}
            data-testid={`filter-${filter.value}`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{filter.label}</span>
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs py-0 px-1.5",
                isActive && "bg-white/20 text-white"
              )}
            >
              {counts[filter.value]}
            </Badge>
          </Button>
        );
      })}
    </div>
  );
}
