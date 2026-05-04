import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Download, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const typeConfig = {
  view: {
    icon: <Eye className="h-4 w-4" />,
    className: "bg-gray-100 text-blue-600 hover:bg-blue-100 border-blue-100",
  },
  edit: {
    icon: <Pencil className="h-4 w-4 text-[#FDAB00]" />,
    className: "bg-[#FFF5DC] text-yellow-600 hover:bg-yellow-100 border-yellow-100",
  },
  delete: {
    icon: <Trash2 className="h-4 w-4" />,
    className: "bg-red-50 text-red-500 hover:bg-red-100 border-red-100",
  },
  download: {
    icon: <Download className="h-4 w-4" />,
    className: "bg-green-50 text-green-600 hover:bg-green-100 border-green-100",
  },
  default: {
    icon: "",
    className: "text-primary",
  },
} satisfies Record<string, { icon: React.ReactNode; className: string }>;

type ActionButtonType = keyof typeof typeConfig;

type ActionButtonProps = {
  tooltip: string;
  type?: ActionButtonType;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & ({ href: string; onClick?: never } | { href?: never; onClick: () => void });

export default function ActionButton({ icon, tooltip, type, href, onClick, className, disabled }: ActionButtonProps) {
  const config = typeConfig[type || "default"];
  const resolvedIcon = icon ?? config.icon;
  const resolvedClassName = cn("size-8 border shadow-none", config.className, className);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Button size="icon" variant="outline" asChild className={resolvedClassName} disabled={disabled}>
            <Link href={href}>{resolvedIcon}</Link>
          </Button>
        ) : (
          <Button size="icon" variant="outline" onClick={onClick} className={resolvedClassName} disabled={disabled}>
            {resolvedIcon}
          </Button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
