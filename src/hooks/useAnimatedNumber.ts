import { useState, useEffect } from "react";

// Fonction utilitaire d'animation
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
      setValue(endValue);
      return;
    }
    setValue(currentValue);
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

// Custom hook pour gérer l'animation de nombre
export const useAnimatedNumber = (endValue: number, duration: number) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    animateNumber(0, endValue, duration, setAnimatedValue);
  }, [endValue, duration]);

  return animatedValue;
};
