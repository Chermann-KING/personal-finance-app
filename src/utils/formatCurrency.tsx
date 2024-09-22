// Utilitaire pour formater la monnaie avec ou sans signe
export const formatCurrency = (amount: number, withSign: boolean = false) => {
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
