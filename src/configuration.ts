import fs from 'node:fs';
import YAML, {ScalarTag} from 'yaml';

export type Configuration = {
    services: Service[];
}

type Service = {
    id: string;
    type: TypeService;
    configuration: ConfigurationService;
}

type ConfigurationService = ConfigurationRedirectionWebhook;

type ConfigurationRedirectionWebhook = {
    idWebhookMattermost: string;
    formatage: string;
    condition?: string;
    entreesSansInjectionsDeMarkdown?: string[];
}

type TypeService = 'redirectionWebhook';

const varTag = (vars: Record<string, unknown>): ScalarTag => ({
    tag: '!var',
    default: true,
    test: /\${{.*}}/,
    resolve: (str, onError) =>
        str.replace(/\${{(.*?)}}/g, (orig, name) => {
            if (Object.prototype.hasOwnProperty.call(vars, name)) {
                return String(vars[name])
            } else {
                onError(`Unknown variable: ${name}`)
                return orig
            }
        })
})

export const recupereConfiguration = (webhookIds: Record<string, string>) => YAML.parse(fs.readFileSync('configuration.yml', 'utf8'), {customTags: [varTag(webhookIds)]}) as Configuration;
