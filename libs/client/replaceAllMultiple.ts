export default function replaceMultiple(text: any, characters: any) {
  for (const [i, each] of characters.entries()) {
    const previousChar = Object.keys(each);
    const newChar = Object.values(each);

    text = text.replaceAll(previousChar, newChar);
  }

  return text;
}
