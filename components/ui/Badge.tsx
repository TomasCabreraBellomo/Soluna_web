export function Badge({ children, tone = "champagne" }: { children: React.ReactNode; tone?: "champagne" | "rose" | "neutral" }) {
  const tones = {
    champagne: "bg-soluna-champagne/15 text-[#8a6a2d]",
    rose: "bg-soluna-rose/25 text-[#7c514d]",
    neutral: "bg-white text-soluna-charcoal"
  };

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
