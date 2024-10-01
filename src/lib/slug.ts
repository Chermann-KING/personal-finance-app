/**
 * Utilitaire pour créer un slug à partir d'une chaîne de caractères.
 *
 * Cette fonction transforme une chaîne de caractères en un slug, c'est-à-dire une version URL-friendly de la chaîne.
 * Elle convertit la chaîne en minuscules, remplace les espaces par des tirets, et supprime tous les caractères spéciaux.
 *
 * @param {string} category - La chaîne de caractères à transformer en slug.
 * @returns {string} - Le slug généré.
 */
export const createSlug = (category: string): string => {
  return category
    .toLowerCase() // Convertir la chaîne en minuscules
    .replace(/ /g, "-") // Remplacer les espaces par des tirets
    .replace(/[^\w-]+/g, ""); // Supprimer les caractères spéciaux
};
