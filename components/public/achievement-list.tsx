import type { Achievement } from "@/types/domain";

interface AchievementListProps {
  achievements: Achievement[];
}

export const AchievementList = ({ achievements }: AchievementListProps) => {
  if (achievements.length === 0) {
    return <p className="text-[var(--outline)] font-[family-name:var(--font-body)] text-xs uppercase tracking-widest font-bold">NO RECOGNITION REGISTERED.</p>;
  }

  return (
    <div className="flex flex-col chrome-border-top border-t-2">
      {achievements.map((item) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12 py-8 chrome-border-bottom">
          <div className="md:col-span-1">
            <p className="font-[family-name:var(--font-body)] text-[10px] font-bold tracking-widest text-[var(--primary)] uppercase mt-2">
               {item.issuer}
            </p>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold uppercase mb-4 tracking-[0.02em] chrome-text-protect inline-block">
              {item.title}
            </h3>
            <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--outline)]">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
