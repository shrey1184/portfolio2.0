import { revalidatePath } from "next/cache";

const PUBLIC_PATHS = ["/", "/projects", "/achievements", "/experience", "/contact"];

export const revalidatePublicRoutes = () => {
  PUBLIC_PATHS.forEach((path) => {
    revalidatePath(path);
  });
};
