import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Flame, Video, MapPin, Clock } from "lucide-react";
import type { Incident, SensorType, AlertPriority } from "@/lib/types";
import { SENSOR_TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  incident: Incident;
  compact?: boolean;
}

const priorityColors: Record<AlertPriority, string> = {
  critical: '#DC2626',
  warning: '#F59E0B',
  normal: '#10B981',
};

const priorityBgStyles: Record<AlertPriority, string> = {
  critical: 'bg-red-50 dark:bg-red-950/30',
  warning: 'bg-amber-50 dark:bg-amber-950/30',
  normal: 'bg-green-50 dark:bg-green-950/30',
};

const priorityIconBgStyles: Record<AlertPriority, string> = {
  critical: 'bg-red-100 dark:bg-red-900',
  warning: 'bg-amber-100 dark:bg-amber-900',
  normal: 'bg-green-100 dark:bg-green-900',
};

const sensorIcons: Record<SensorType, typeof Volume2> = {
  sound: Volume2,
  smoke: Flame,
  motion: Video,
};

export function AlertCard({ incident, compact = false }: AlertCardProps) {
  const accentColor = priorityColors[incident.priority];
  const Icon = sensorIcons[incident.sensorType];

  if (compact) {
    return (
      <Card 
        className={cn(
          "accent-bar-left accent-bar-left-compact hover-elevate cursor-pointer transition-all duration-200",
          !incident.resolved && priorityBgStyles[incident.priority]
        )}
        style={{ '--accent-color': accentColor } as React.CSSProperties}
        data-testid={`alert-card-${incident.id}`}
      >
        <CardContent className="p-5 pl-6">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
              priorityIconBgStyles[incident.priority]
            )}>
              <Icon className="w-4 h-4" style={{ color: accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-semibold text-sm truncate">{incident.title}</h4>
                {!incident.resolved && (
                  <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelativeTime(incident.timestamp)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {incident.location.zone}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "accent-bar-left hover-elevate cursor-pointer transition-all duration-200",
        !incident.resolved && priorityBgStyles[incident.priority]
      )}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
      data-testid={`alert-card-${incident.id}`}
    >
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center",
              priorityIconBgStyles[incident.priority]
            )}>
              <Icon className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="font-semibold">{incident.title}</h3>
              <p className="text-sm text-muted-foreground">{SENSOR_TYPE_LABELS[incident.sensorType]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className="text-xs text-white"
              style={{ backgroundColor: accentColor }}
            >
              {PRIORITY_LABELS[incident.priority]}
            </Badge>
            {!incident.resolved && (
              <div className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {incident.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatRelativeTime(incident.timestamp)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {incident.location.zone}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
