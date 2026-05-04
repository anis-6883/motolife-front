interface OfficeInfoProps {
  name?: string;
  address?: string;
  district?: string;
  thana?: string;
  area?: string;
}

export function AddressInfoCard({ name, address, district, thana, area }: OfficeInfoProps) {
  return (
    <div className="w-full rounded-xl border border-neutral-200/40 bg-white p-5 font-['Inter',system-ui,sans-serif] shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header / Name */}
      <div className="mb-3">
        <p className="mb-1 text-xs font-medium tracking-wide text-neutral-600/90 uppercase">Name</p>
        <p className="text-[0.9375rem] leading-tight text-neutral-900">{name}</p>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-200/80" />

      {/* Address - multi line */}
      <div className="mb-3">
        <p className="mb-1 text-xs font-medium tracking-wide text-neutral-600/90 uppercase">Address</p>
        <p className="text-[0.9375rem] leading-relaxed whitespace-pre-line text-neutral-900">{address}</p>
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-neutral-200/80" />

      {/* Grid for district, thana, area */}
      <div className="mt-2 grid grid-cols-3 gap-4">
        {/* District */}
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-neutral-600/90 uppercase">District</p>
          <p className="text-[0.9375rem] text-neutral-900">{district}</p>
        </div>

        {/* Thana */}
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-neutral-600/90 uppercase">Thana</p>
          <p className="text-[0.9375rem] text-neutral-900">{thana}</p>
        </div>

        {/* Area */}
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-neutral-600/90 uppercase">Area</p>
          <p className="text-[0.9375rem] text-neutral-900">{area}</p>
        </div>
      </div>
    </div>
  );
}

// Optional: export default for easy import
export default AddressInfoCard;
