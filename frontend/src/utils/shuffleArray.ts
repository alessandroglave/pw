export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  return [...array].sort(() => Math.random() - 0.5);
};
