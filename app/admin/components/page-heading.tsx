export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="mb-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4a7b1d]">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[#111827] md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
    </header>
  );
}
