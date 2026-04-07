import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { MapView } from "@/components/MapView";
import { ActiveAlerts } from "@/components/ActiveAlerts";
import { IncidentTimeline } from "@/components/IncidentTimeline";
import { SensorStatusGrid } from "@/components/SensorStatusGrid";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-background" data-testid="dashboard">
      <Header />
      
      <main className="p-5 max-w-[1920px] mx-auto">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-foreground mb-1">
            Vue d'ensemble
          </h2>
          <p className="text-muted-foreground">
            Surveillance en temps réel des zones protégées
          </p>
        </div>

        <div className="space-y-5">
          <StatsCards />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <MapView />
            </div>
            <div className="xl:col-span-1">
              <ActiveAlerts />
            </div>
          </div>

          <SensorStatusGrid />

          <IncidentTimeline />
        </div>
      </main>

      <footer className="py-4 px-5 text-center text-sm text-muted-foreground border-t bg-background">
        <p>Surveillance IoT - Tableau de Bord v1.0</p>
      </footer>
    </div>
  );
}
