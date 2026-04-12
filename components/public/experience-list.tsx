import type { ExperienceItem } from "@/types/domain";

interface ExperienceListProps {
  items: ExperienceItem[];
}

export const ExperienceList = ({ items }: ExperienceListProps) => {
  if (items.length === 0) {
    return <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">NO DATA FOUND.</p>;
  }

  return (
    <div className="flex flex-col gap-16">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-4 chrome-border-bottom pb-16 last:border-0 last:pb-0">
          <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-bold uppercase leading-[1.1] tracking-[0.02em] max-w-3xl chrome-text-protect inline-block">
            {item.role}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[10px] font-[family-name:var(--font-body)] font-bold tracking-widest text-[var(--outline)] uppercase mt-2">
			 <span>{item.company}</span>
			 <span className="hidden sm:inline">//</span>
			 <span>{item.location}</span>
          </div>
          <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed max-w-2xl mt-6">
            {item.summary}
          </p>
        </div>
      ))}
    </div>
  );
};
