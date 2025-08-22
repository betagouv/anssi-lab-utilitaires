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

export const formatagePayload = (template: string, donnees: Record<string, any>) => {
    const regex = /{([\w.]+)}/gm;

    return [...template.matchAll(regex)].reduce((acc, match) => {
        const [aRemplacer, cle] = match;
        return acc.replace(aRemplacer, proprieteFille(cle, donnees))
    }, template);
}