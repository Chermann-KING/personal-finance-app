export const createSlug = (category: string): string => {
  return category
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, ""); // Supprimer les caractères spéciaux
};
