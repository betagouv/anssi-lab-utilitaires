import express from 'express';
import fs from 'fs';
import YAML, {ScalarTag} from 'yaml';
import {Configuration} from "types";
import {formatagePayload} from "./formatage/formatagePayload";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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
const configuration = YAML.parse(fs.readFileSync('configuration.yml', 'utf8'), {customTags: [varTag({...process.env})]}) as Configuration;

const webhooks = configuration.services.filter((s) => s.type === 'redirectionWebhook');
for (const webhook of webhooks) {
    app.post(`/webhooks/${webhook.id}`, async (requete, reponse) => {
        if(webhook.configuration.condition) {
            const conditionFormatee = formatagePayload(webhook.configuration.condition, requete.body);
            const condition = eval(conditionFormatee);
            if(!condition) {
                reponse.sendStatus(200);
                return;
            }
        }
        const donnees = {text: formatagePayload(webhook.configuration.formatage, requete.body)};

        await fetch(`https://mattermost.incubateur.net/hooks/${webhook.configuration.idWebhookMattermost}`, {
            method: 'post',
            body: JSON.stringify(donnees),
            headers: {'Content-Type': 'application/json'}
        });

        reponse.sendStatus(200);
    });
}

app.listen(port, () => {
    console.log(
        `Lab ANSSI Utilitaires est démarré et écoute sur le port ${port} !…`,
    );
});