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

const identite = (x: any) => x;

type Aseptiseur = (c: string) => string;
type Formateur = (template: string, donnees: Record<string, any>, aNePasAseptiser?: string[]) => string;
type FabriqueFormateur = (aseptiseMarkdown: Aseptiseur) => Formateur;

export const fabriqueFormatagePayload: FabriqueFormateur = (aseptiseMarkdown) => {
    return (template, donnees, aNePasAseptiser = []) => {
        const regex = /{([\w.]+)}/gm;

        return [...template.matchAll(regex)].reduce((acc, match) => {
            const [aRemplacer, cle] = match;

            const transformeLaValeur = aNePasAseptiser.includes(cle)
              ? identite
              : aseptiseMarkdown;

            return acc.replace(aRemplacer, transformeLaValeur(proprieteFille(cle, donnees)));
        }, template);
    };
}
