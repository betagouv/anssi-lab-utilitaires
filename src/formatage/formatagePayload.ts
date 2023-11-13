export const formatagePayload = (template: string, donnees: Record<string, any>) => {
    const regex = /{(\w+)}/gm;

    return [...template.matchAll(regex)].reduce((acc, match) => {
        const [aRemplacer, cle] = match;
        return acc.replace(aRemplacer, donnees[cle])
    }, template);
}