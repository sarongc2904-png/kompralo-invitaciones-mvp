type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, description, align = "center" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-ink/68">{description}</p> : null}
    </div>
  );
}
