import { useState, useEffect } from "react";

/**
 * Fonction utilitaire pour animer la transition d'un nombre d'une valeur de départ à une valeur de fin.
 *
 * Cette fonction incrémente ou décrémente progressivement une valeur de départ vers une valeur de fin
 * sur une durée donnée, en utilisant `requestAnimationFrame` pour une animation fluide à environ 60 fps.
 *
 * @param {number} startValue - La valeur de départ de l'animation.
 * @param {number} endValue - La valeur cible vers laquelle animer.
 * @param {number} duration - La durée totale de l'animation en millisecondes.
 * @param {React.Dispatch<React.SetStateAction<number>>} setValue - Fonction pour mettre à jour la valeur animée.
 */
const animateNumber = (
  startValue: number,
  endValue: number,
  duration: number,
  setValue: React.Dispatch<React.SetStateAction<number>>
) => {
  const range = endValue - startValue;
  const increment = range / (duration / 16.67); // approx 60 frames per second
  let currentValue = startValue;

  const step = () => {
    currentValue += increment;
    if (
      (increment > 0 && currentValue >= endValue) ||
      (increment < 0 && currentValue <= endValue)
    ) {
      setValue(endValue); // Fixe la valeur finale une fois l'animation terminée
      return;
    }
    setValue(currentValue);
    requestAnimationFrame(step); // Appel récursif pour chaque frame
  };

  requestAnimationFrame(step); // Déclenche l'animation
};

/**
 * Hook personnalisé pour animer une valeur numérique d'une valeur de départ (0) à une valeur cible.
 *
 * Ce hook est utile pour des animations de compteurs ou des éléments dont la valeur change de manière progressive.
 * Il anime un nombre sur une durée définie et renvoie la valeur actuelle à chaque frame de l'animation.
 *
 * @param {number} endValue - La valeur cible que l'animation doit atteindre.
 * @param {number} duration - La durée de l'animation en millisecondes.
 * @returns {number} - La valeur animée actuelle.
 */
export const useAnimatedNumber = (
  endValue: number,
  duration: number
): number => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    animateNumber(0, endValue, duration, setAnimatedValue); // Démarre l'animation
  }, [endValue, duration]);

  return animatedValue; // Renvoie la valeur animée
};
