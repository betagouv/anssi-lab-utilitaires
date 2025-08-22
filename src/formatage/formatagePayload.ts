const proprieteFille = (chaine: string, obj: any) => {
    const tableau = chaine.split(".");
    while(tableau.length && (obj = obj[tableau.shift()]));
    return `${obj}`;
};

export const aseptiseMarkdown = (contenu: string) =>
  ["\\", "!", "[", "]", "`", "{", "}", "*", "_", "<", ">", "(", ")", "#", "+", "-", ".", "|"]
      .reduce(
          (acc, caractere) => acc.replaceAll(caractere, `\\${caractere}`),
          contenu,
      );

type Aseptiseur = (c: string) => string;
export const fabriqueFormatagePayload = (aseptiseMarkdown: Aseptiseur) => {
    return (template: string, donnees: Record<string, any>) => {
        const regex = /{([\w.]+)}/gm;

        return [...template.matchAll(regex)].reduce((acc, match) => {
            const [aRemplacer, cle] = match;
            return acc.replace(aRemplacer, aseptiseMarkdown(proprieteFille(cle, donnees)))
        }, template);
    };
}
