export default function DashboardLoader() {
  const items = Array.from({ length: 9 });

  return (
    <div className="grid h-20 w-20 grid-cols-3 grid-rows-3 gap-1">
      {items.map((_, index) => (
        <div
          key={index}
          className="bg-primary h-full w-full"
          style={{
            animation: `flipping 1.5s ${index * 0.1}s infinite backwards`,
          }}
        ></div>
      ))}

      <style>
        {`
          @keyframes flipping {
            0% {
              transform: perspective(100px) rotateX(-90deg);
            }
            50%, 75% {
              transform: perspective(100px) rotateX(0);
            }
            100% {
              opacity: 0;
              transform: perspective(100px) rotateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}
