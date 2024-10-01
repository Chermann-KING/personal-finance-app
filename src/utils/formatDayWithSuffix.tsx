/**
 * Utilitaire pour formater un jour avec le suffixe ordinal approprié (st, nd, rd, th).
 *
 * Cette fonction ajoute le suffixe ordinal correct à un numéro de jour (ex: "1st", "2nd", "3rd", "4th", etc.).
 * Les suffixes sont basés sur les règles anglaises :
 * - 1er jour : "st"
 * - 2ème jour : "nd"
 * - 3ème jour : "rd"
 * - 4ème jour et au-delà : "th"
 * - Pour les nombres de 11 à 13 inclus, le suffixe est toujours "th" en raison des exceptions dans la langue anglaise.
 *
 * @param {number} day - Le numéro de jour à formater.
 * @returns {string} - Le jour formaté avec son suffixe ordinal.
 */
export const formatDayWithSuffix = (day: number): string => {
  // Pour les nombres de 11 à 13 inclus, le suffixe est "th"
  if (day > 3 && day < 21) return `${day}th`;

  // Calcul du suffixe en fonction du reste de la division par 10
  switch (day % 10) {
    case 1:
      return `${day}st`; // 1 -> 1st, 21st, 31st, etc.
    case 2:
      return `${day}nd`; // 2 -> 2nd, 22nd, etc.
    case 3:
      return `${day}rd`; // 3 -> 3rd, 23rd, etc.
    default:
      return `${day}th`; // Tous les autres cas
  }
};
