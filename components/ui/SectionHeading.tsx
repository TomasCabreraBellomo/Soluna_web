export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-soluna-champagne">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl leading-tight text-soluna-charcoal md:text-5xl">{title}</h2>
      {text ? <p className="mt-4 text-sm leading-7 text-soluna-charcoal/70 md:text-base">{text}</p> : null}
    </div>
  );
}
