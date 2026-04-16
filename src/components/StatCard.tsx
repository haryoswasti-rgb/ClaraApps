import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, gradient, delay = 0 }: Props) {
  return (
    <div
      className="bg-card rounded-xl shadow-card p-5 flex items-center gap-4 animate-fade-in-up hover:shadow-card-hover transition-shadow"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
