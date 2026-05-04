"use server";

import { requireAdmin } from "@/lib/auth";
import { revalidatePublicRoutes } from "@/lib/revalidate";
import { HOMEPAGE_SECTIONS, type HomeSectionId } from "@/types/domain";

const normalizeSections = (sections: HomeSectionId[]) => {
  const unique = Array.from(new Set(sections));

  if (unique.length !== HOMEPAGE_SECTIONS.length) {
    throw new Error("Invalid section list length.");
  }

  if (!unique.every((section) => HOMEPAGE_SECTIONS.includes(section))) {
    throw new Error("Invalid section key detected.");
  }

  return unique;
};

export const saveLayoutAction = async (sections: HomeSectionId[]) => {
  const { supabase } = await requireAdmin();
  const normalized = normalizeSections(sections);

  const { error } = await supabase.from("layout_config").upsert({
    id: 1,
    sections: normalized,
  });

  if (error) {
    throw new Error(`Failed to save layout configuration: ${error.message}`);
  }

  revalidatePublicRoutes();
};
