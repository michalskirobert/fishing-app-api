export function capitalizeFirstLetter(word: string) {
  if (!word?.length) {
    return word; // return the word as is if it's empty
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}
