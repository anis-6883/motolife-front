export function RibbonBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative inline-block">
      <div
        className="bg-primary p-text-14 flex items-center py-1 pr-6 pl-2 font-medium text-white"
        style={{
          clipPath: "polygon(0 0, 100% 0, 90% 50%, 100% 100%, 0 100%)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
