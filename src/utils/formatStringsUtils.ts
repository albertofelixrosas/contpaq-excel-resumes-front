export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-digit characters
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  // Apply the formatting regex for US numbers (10 digits)
  if (cleanedNumber.length === 10) {
    return cleanedNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  } else {
    // Handle other lengths or return original if not a 10-digit number
    return phoneNumber;
  }
};

export function capitalizeEachWord(input: string) {
  // Split the string into an array of words
  const words = input.split(' ');

  // Map over each word to capitalize its first letter
  const capitalizedWords = words.map(word => {
    if (word.length === 0) {
      return ''; // Handle empty strings if present in the split array
    }
    // Capitalize the first letter and concatenate with the rest of the word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the capitalized words back into a single string
  return capitalizedWords.join(' ');
}