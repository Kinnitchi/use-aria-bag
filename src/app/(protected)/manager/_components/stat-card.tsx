interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}

export function StatCard({ label, value, sub, icon: Icon, accent = false }: StatCardProps) {
  return (
    <div
      className={`border-border flex flex-col gap-3 rounded-2xl border p-6 shadow-sm ${
        accent ? "bg-ring text-primary-foreground" : "bg-card text-foreground"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium tracking-widest uppercase ${
            accent ? "text-primary-foreground/70" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        <Icon className={`size-5 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`} />
      </div>
      <span className="font-serif text-3xl font-semibold">{value}</span>
      {sub && (
        <span className={`text-xs ${accent ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{sub}</span>
      )}
    </div>
  );
}
