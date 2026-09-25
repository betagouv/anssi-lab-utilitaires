import fs from 'node:fs';
import YAML, {ScalarTag} from 'yaml';

export type Configuration = {
    services: Service[];
}

export type Service = {
    id: string;
    type: TypeService;
    configuration: ConfigurationService;
}

type ConfigurationService = ConfigurationRedirectionWebhook;

type ConfigurationRedirectionWebhook = {
    urlHoteMattermost: string
    idWebhookMattermost: string;
    formatage: string;
    condition?: string;
    entreesSansInjectionsDeMarkdown?: string[];
}

type TypeService = 'redirectionWebhook';

type Variables = Record<string, string | undefined>;

const tagEnv = (variables: Variables, manquantes: string[]): ScalarTag => ({
    tag: '!env',
    resolve: (nom) => {
        const valeur = variables[nom];
        if (!valeur) manquantes.push(nom);
        return valeur ?? '';
    }
})

export const recupereConfiguration = (variables: Variables): Configuration => {
    const manquantes: string[] = [];
    const configuration = YAML.parse(fs.readFileSync('configuration.yml', 'utf8'), {customTags: [tagEnv(variables, manquantes)]}) as Configuration;
    if (manquantes.length > 0) {
        throw new Error(`Variables d'environnement manquantes : ${[...new Set(manquantes)].join(', ')}`);
    }
    return configuration;
}
