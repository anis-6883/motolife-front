import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: "blue" | "orange" | "purple";
}

const colorStyles = {
  blue: {
    text: "text-blue-500",
    bg: "bg-blue-50",
  },
  orange: {
    text: "text-amber-500",
    bg: "bg-amber-50",
  },
  purple: {
    text: "text-violet-500",
    bg: "bg-violet-50",
  },
};

export default function StatCard({ label, value, icon, color = "blue" }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="flex min-w-[160px] items-center gap-3 px-4 py-3">
      <div className={`rounded-lg p-2 ${styles.bg}`}>
        <div className={`h-5 w-5 ${styles.text}`}>{icon}</div>
      </div>

      <div>
        <p className="whites pace-nowrap text-xs font-medium text-gray-500">{label}</p>

        <p className={`text-2xl leading-tight font-bold ${styles.text}`}>{typeof value === "number" ? value.toLocaleString() : value}</p>
      </div>
    </div>
  );
}
