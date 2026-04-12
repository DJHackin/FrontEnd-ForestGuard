import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { AlertCard } from "./AlertCard";
import { useAlertes } from "@/hooks/useAlertes";

export function ActiveAlerts() {
  const { data: incidents = [], isLoading, isError } = useAlertes();

  const activeIncidents = incidents
    .filter(i => !i.resolved)
    .sort((a, b) => {
      const priorityOrder = { critical: 0, warning: 1, normal: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;
  if (isError) return <p className="text-red-500">Erreur de connexion au serveur</p>;

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