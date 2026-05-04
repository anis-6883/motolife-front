import Image from "next/image";

export default function MaintenanceModePage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fefefe] px-4 py-8">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        {/* Maintenance Image */}
        <div className="relative mb-6 h-48 w-full sm:h-72 md:h-96">
          <Image src="/images/shared/maintenance-mode.png" alt="Under Maintenance" fill className="object-contain" priority />
        </div>

        {/* Maintenance Text */}
        <div className="flex flex-col items-center space-y-3 px-2">
          <h1 className="max-w-75 text-2xl font-bold tracking-tight text-gray-900 sm:max-w-none sm:text-3xl md:text-4xl">
            We are Under Maintenance
          </h1>
          <p className="text-base font-semibold text-[#b21619] sm:text-lg md:text-xl">Will be Back Soon!</p>
        </div>
      </div>
    </div>
  );
}
