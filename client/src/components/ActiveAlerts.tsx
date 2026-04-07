import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { AlertCard } from "./AlertCard";
import { mockIncidents } from "@/lib/mockData";

export function ActiveAlerts() {
  const activeIncidents = mockIncidents
    .filter(i => !i.resolved)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, warning: 1, normal: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  return (
    <Card data-testid="active-alerts">
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
          Alertes Actives
        </CardTitle>
        {activeIncidents.length > 0 && (
          <Badge className="bg-[#DC2626] text-white animate-pulse">
            {activeIncidents.length}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {activeIncidents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#10B981]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-[#10B981]">Aucune alerte active</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tous les capteurs fonctionnent normalement
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeIncidents.map((incident) => (
              <AlertCard key={incident.id} incident={incident} compact />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
