import { Shield, Bell, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockStats } from "@/lib/mockData";

export function Header() {
  const { activeIncidents } = mockStats;

  return (
    <header 
      className="h-[70px] bg-[#1E3A8A] text-white flex items-center justify-between px-5 sticky top-0 z-50"
      data-testid="header"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Surveillance IoT</h1>
            <p className="text-xs text-blue-200">Tableau de Bord</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium">En ligne</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center hover-elevate active-elevate-2"
              data-testid="button-notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            {activeIncidents > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#DC2626] rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
                {activeIncidents}
              </span>
            )}
          </div>

          {activeIncidents > 0 && (
            <Badge 
              variant="destructive" 
              className="bg-[#DC2626] text-white flex items-center gap-2 py-1.5 px-3"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{activeIncidents} alerte{activeIncidents > 1 ? 's' : ''} active{activeIncidents > 1 ? 's' : ''}</span>
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
