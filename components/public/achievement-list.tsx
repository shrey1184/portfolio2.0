import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Achievement } from "@/types/domain";

interface AchievementListProps {
  achievements: Achievement[];
}

const formatDate = (date: string | null) => {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const AchievementList = ({ achievements }: AchievementListProps) => {
  if (achievements.length === 0) {
    return <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">No published achievements yet.</p>;
  }

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="border-white/70 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="text-xl text-[var(--secondary-color)]">{achievement.title}</CardTitle>
              {achievement.achieved_at ? <Badge variant="secondary">{formatDate(achievement.achieved_at)}</Badge> : null}
            </div>
            <p className="text-sm font-medium text-[var(--primary-color)]">{achievement.issuer}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {achievement.image_url ? (
                <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                  <Image src={achievement.image_url} alt={achievement.title} fill className="object-cover" />
                </div>
              ) : null}
              <p className="text-sm leading-6 text-slate-600">{achievement.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
