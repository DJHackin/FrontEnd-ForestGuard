import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Flame, Video, MapPin, Clock, CheckCircle } from "lucide-react";
import type { Incident, SensorType, AlertPriority } from "@/lib/types";
import { SENSOR_TYPE_LABELS, PRIORITY_LABELS } from "@/lib/types";
import { formatRelativeTime, formatTime, getDateLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { mockIncidents } from "@/lib/mockData";
import { SensorFilters } from "./SensorFilters";

const sensorIcons: Record<SensorType, typeof Volume2> = {
  sound: Volume2,
  smoke: Flame,
  motion: Video,
};

const priorityColors: Record<AlertPriority, string> = {
  critical: 'bg-[#DC2626]',
  warning: 'bg-[#F59E0B]',
  normal: 'bg-[#10B981]',
};

interface GroupedIncidents {
  dateLabel: string;
  incidents: Incident[];
}

function groupIncidentsByDate(incidents: Incident[]): GroupedIncidents[] {
  const groups: Map<string, Incident[]> = new Map();
  
  incidents.forEach((incident) => {
    const label = getDateLabel(incident.timestamp);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(incident);
  });

  return Array.from(groups.entries()).map(([dateLabel, incidents]) => ({
    dateLabel,
    incidents: incidents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
  }));
}

function TimelineItem({ incident }: { incident: Incident }) {
  const Icon = sensorIcons[incident.sensorType];

  return (
    <div 
      className="relative pl-8 pb-6 last:pb-0 group"
      data-testid={`timeline-item-${incident.id}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border group-last:bg-transparent" />
      
      <div className={cn(
        "absolute left-[-5px] top-1 w-3 h-3 rounded-full ring-4 ring-background",
        priorityColors[incident.priority],
        !incident.resolved && "animate-pulse"
      )} />

      <Card className={cn(
        "hover-elevate transition-all duration-200",
        !incident.resolved && incident.priority === 'critical' && "border-[#DC2626] bg-red-50/50 dark:bg-red-950/20",
        !incident.resolved && incident.priority === 'warning' && "border-[#F59E0B] bg-amber-50/50 dark:bg-amber-950/20"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
              incident.priority === 'critical' ? 'bg-red-100 dark:bg-red-900' :
              incident.priority === 'warning' ? 'bg-amber-100 dark:bg-amber-900' :
              'bg-green-100 dark:bg-green-900'
            )}>
              <Icon className={cn(
                "w-4 h-4",
                incident.priority === 'critical' ? 'text-[#DC2626]' :
                incident.priority === 'warning' ? 'text-[#F59E0B]' :
                'text-[#10B981]'
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-sm">{incident.title}</h4>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                  >
                    {SENSOR_TYPE_LABELS[incident.sensorType]}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={cn(
                    "text-xs",
                    incident.priority === 'critical' ? 'bg-[#DC2626]' :
                    incident.priority === 'warning' ? 'bg-[#F59E0B]' :
                    'bg-[#10B981]',
                    "text-white"
                  )}>
                    {PRIORITY_LABELS[incident.priority]}
                  </Badge>
                  {incident.resolved && (
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {incident.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(incident.timestamp)}
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
    </div>
  );
}

export function IncidentTimeline() {
  const [filter, setFilter] = useState<SensorType | 'all'>('all');

  const filteredIncidents = useMemo(() => {
    if (filter === 'all') return mockIncidents;
    return mockIncidents.filter(i => i.sensorType === filter);
  }, [filter]);

  const groupedIncidents = useMemo(() => 
    groupIncidentsByDate(filteredIncidents),
    [filteredIncidents]
  );

  const counts = useMemo(() => ({
    all: mockIncidents.length,
    sound: mockIncidents.filter(i => i.sensorType === 'sound').length,
    smoke: mockIncidents.filter(i => i.sensorType === 'smoke').length,
    motion: mockIncidents.filter(i => i.sensorType === 'motion').length,
  }), []);

  return (
    <Card data-testid="incident-timeline">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg font-semibold">Historique des Incidents</CardTitle>
        <SensorFilters 
          activeFilter={filter} 
          onFilterChange={setFilter} 
          counts={counts}
        />
      </CardHeader>
      <CardContent className="pt-0">
        {groupedIncidents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Aucun incident trouvé</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedIncidents.map((group) => (
              <div key={group.dateLabel}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm font-medium text-muted-foreground px-2">
                    {group.dateLabel}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="relative">
                  {group.incidents.map((incident) => (
                    <TimelineItem key={incident.id} incident={incident} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
