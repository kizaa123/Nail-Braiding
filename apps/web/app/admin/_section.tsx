export default function AdminSection({ title, endpoint }: { title: string; endpoint: string }) {
  return (
    <div>
      <h2 className="font-display text-4xl font-normal text-[#171211]">{title}</h2>
      <div className="mt-6 rounded-2xl border border-[#EADBCE] bg-white p-8 shadow-[0_8px_24px_rgba(23,18,17,0.04)]">
        <p className="text-sm leading-relaxed text-[#A99B95]">
          This section is ready in the studio portal. Live data for this screen uses the booking API when it is running.
        </p>
        <div className="mt-4 rounded-xl border border-[#EADBCE] bg-[#F7F1EA] p-4 font-mono text-xs text-[#7A6E68]">
          Endpoint: <span className="font-semibold text-[#171211]">{endpoint}</span>
        </div>
      </div>
    </div>
  );
}
