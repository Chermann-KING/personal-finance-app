/**
 * Utilitaire pour formater un montant en monnaie avec ou sans signe.
 *
 * Cette fonction formate un montant donné en devise (USD) avec deux chiffres après la virgule.
 * Elle peut également ajouter un signe "+" ou "-" en fonction de la valeur du montant et de la valeur du paramètre `withSign`.
 *
 * @param {number} amount - Le montant à formater.
 * @param {boolean} [withSign=false] - Indique si le formatage doit inclure un signe "+" ou "-" (par défaut: `false`).
 * @returns {string} - Le montant formaté en tant que chaîne de caractères, avec ou sans signe.
 */
export const formatCurrency = (
  amount: number,
  withSign: boolean = false
): string => {
  // Formater le montant en USD avec 2 chiffres après la virgule
  const formattedAmount = Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  // Si withSign est vrai, ajoute le signe + ou -
  if (withSign) {
    return amount >= 0 ? `+${formattedAmount}` : `-${formattedAmount}`;
  }

  return formattedAmount;
};
