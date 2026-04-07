import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, Flame, Video, Battery, Wifi, Clock } from "lucide-react";
import type { Sensor, SensorType, SensorStatus } from "@/lib/types";
import { STATUS_LABELS, SENSOR_TYPE_LABELS } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { mockSensors } from "@/lib/mockData";

const sensorIcons: Record<SensorType, typeof Volume2> = {
  sound: Volume2,
  smoke: Flame,
  motion: Video,
};

const statusStyles: Record<SensorStatus, { badge: string; dot: string }> = {
  active: {
    badge: 'bg-[#10B981] text-white',
    dot: 'bg-[#10B981]',
  },
  inactive: {
    badge: 'bg-gray-400 text-white',
    dot: 'bg-gray-400',
  },
  alert: {
    badge: 'bg-[#DC2626] text-white',
    dot: 'bg-[#DC2626]',
  },
};

function SensorCard({ sensor }: { sensor: Sensor }) {
  const Icon = sensorIcons[sensor.type];
  const styles = statusStyles[sensor.status];

  return (
    <Card 
      className={cn(
        "hover-elevate transition-all duration-200",
        sensor.status === 'alert' && "border-[#DC2626] bg-red-50/50 dark:bg-red-950/20"
      )}
      data-testid={`sensor-card-${sensor.id}`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-md flex items-center justify-center",
              sensor.status === 'active' ? 'bg-green-100 dark:bg-green-900' :
              sensor.status === 'alert' ? 'bg-red-100 dark:bg-red-900' :
              'bg-gray-100 dark:bg-gray-800'
            )}>
              <Icon className={cn(
                "w-5 h-5",
                sensor.status === 'active' ? 'text-[#10B981]' :
                sensor.status === 'alert' ? 'text-[#DC2626]' :
                'text-gray-500'
              )} />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-sm truncate">{sensor.name}</h4>
              <p className="text-xs text-muted-foreground">{SENSOR_TYPE_LABELS[sensor.type]}</p>
            </div>
          </div>
          <Badge className={cn(styles.badge, "text-xs shrink-0")}>
            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", styles.dot, sensor.status === 'alert' && 'animate-pulse')} />
            {STATUS_LABELS[sensor.status]}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Battery className="w-3.5 h-3.5" />
              Batterie
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    sensor.battery > 50 ? 'bg-[#10B981]' :
                    sensor.battery > 20 ? 'bg-[#F59E0B]' :
                    'bg-[#DC2626]'
                  )}
                  style={{ width: `${sensor.battery}%` }}
                />
              </div>
              <span className="font-medium w-8 text-right">{sensor.battery}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Wifi className="w-3.5 h-3.5" />
              Signal
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5 h-3">
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className={cn(
                      "w-1 rounded-sm transition-all",
                      sensor.signalStrength >= bar * 25 ? 'bg-[#10B981]' : 'bg-muted'
                    )}
                    style={{ height: `${bar * 25}%` }}
                  />
                ))}
              </div>
              <span className="font-medium w-8 text-right">{sensor.signalStrength}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Dernière mise à jour
            </span>
            <span className="font-medium">{formatRelativeTime(sensor.lastUpdate)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SensorStatusGrid() {
  return (
    <Card data-testid="sensor-status-grid">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg font-semibold">État des Capteurs</CardTitle>
        <Badge variant="outline" className="text-xs">
          {mockSensors.filter(s => s.status !== 'inactive').length}/{mockSensors.length} en ligne
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {mockSensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
