import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExperienceItem } from "@/types/domain";

interface ExperienceListProps {
  items: ExperienceItem[];
}

const formatRange = (startDate: string, endDate: string | null) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });

  const start = formatter.format(new Date(startDate));
  const end = endDate ? formatter.format(new Date(endDate)) : "Present";

  return `${start} - ${end}`;
};

export const ExperienceList = ({ items }: ExperienceListProps) => {
  if (items.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No published experience yet.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="border-white/70 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-xl text-[var(--secondary-color)]">{item.role}</CardTitle>
              <Badge variant="secondary">{formatRange(item.start_date, item.end_date)}</Badge>
            </div>
            <p className="text-sm font-medium text-[var(--primary-color)]">
              {item.company} • {item.location}
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {item.image_url ? (
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                  <Image src={item.image_url} alt={item.company} fill className="object-cover" />
                </div>
              ) : null}
              <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
