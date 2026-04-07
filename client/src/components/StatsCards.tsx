import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Activity, Wifi, TrendingUp } from "lucide-react";
import { mockStats } from "@/lib/mockData";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: typeof AlertTriangle;
  accentColor: string;
  iconBgClass: string;
  children?: React.ReactNode;
}

function StatCard({ title, value, icon: Icon, accentColor, iconBgClass, children }: StatCardProps) {
  return (
    <Card 
      className="accent-bar-left" 
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <CardContent className="p-5 pl-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-md flex items-center justify-center ${iconBgClass}`}>
            <Icon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const { totalAlerts24h, activeIncidents, sensorsOnline, sensorsTotal, alertsTrend } = mockStats;
  const onlinePercentage = Math.round((sensorsOnline / sensorsTotal) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-testid="stats-cards">
      <StatCard
        title="Alertes (24h)"
        value={totalAlerts24h}
        icon={AlertTriangle}
        accentColor="#DC2626"
        iconBgClass="bg-red-50 dark:bg-red-950"
      >
        <div className="mt-4 h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={alertsTrend}>
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#DC2626" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </StatCard>

      <StatCard
        title="Incidents Actifs"
        value={activeIncidents}
        icon={Activity}
        accentColor={activeIncidents > 0 ? "#F59E0B" : "#10B981"}
        iconBgClass={activeIncidents > 0 ? "bg-amber-50 dark:bg-amber-950" : "bg-green-50 dark:bg-green-950"}
      >
        {activeIncidents > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-sm text-[#F59E0B] font-medium">
              Intervention requise
            </span>
          </div>
        )}
      </StatCard>

      <StatCard
        title="Capteurs En Ligne"
        value={`${sensorsOnline}/${sensorsTotal}`}
        icon={Wifi}
        accentColor="#10B981"
        iconBgClass="bg-green-50 dark:bg-green-950"
      >
        <div className="mt-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#10B981] rounded-full transition-all duration-500"
              style={{ width: `${onlinePercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{onlinePercentage}% opérationnels</p>
        </div>
      </StatCard>

      <StatCard
        title="Tendance Journalière"
        value=""
        icon={TrendingUp}
        accentColor="#3B82F6"
        iconBgClass="bg-blue-50 dark:bg-blue-950"
      >
        <p className="text-3xl font-bold flex items-center gap-2 -mt-6">
          <TrendingUp className="w-6 h-6 text-[#10B981]" />
          <span className="text-lg text-[#10B981]">-12%</span>
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          vs. semaine précédente
        </p>
      </StatCard>
    </div>
  );
}
