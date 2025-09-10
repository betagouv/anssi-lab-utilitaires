import express from 'express';
import type { Application } from 'express';
import {Configuration} from "./configuration";
import {aseptiseMarkdown, fabriqueFormatagePayload} from "./formatage/formatagePayload";

const fabriqueApplication: (configuration: Configuration) => Application = (configuration) => {
    const app = express();
    app.use(express.json());

    const formatagePayload = fabriqueFormatagePayload(aseptiseMarkdown);

    const webhooks = configuration.services;
    for (const webhook of webhooks) {

        app.post(`/webhooks/${webhook.id}`, async (requete, reponse) => {
            const donneesRecues = requete.body;
            const entreesANePasAseptiser = webhook.configuration.entreesSansInjectionsDeMarkdown;
            const rempli = (template: string) => formatagePayload(template, donneesRecues, entreesANePasAseptiser);

            if(webhook.configuration.condition) {
                const conditionFormatee = rempli(webhook.configuration.condition);
                const condition = eval(conditionFormatee);
                if(!condition) {
                    reponse.sendStatus(200);
                    return;
                }
            }
            const donneesEnvoyees = {text: rempli(webhook.configuration.formatage)};

            await fetch(`https://mattermost.incubateur.net/hooks/${webhook.configuration.idWebhookMattermost}`, {
                method: 'post',
                body: JSON.stringify(donneesEnvoyees),
                headers: {'Content-Type': 'application/json'}
            });

            reponse.sendStatus(200);
        });
    }

    return app;
};

const demarre = (application: Application, port: number) => {
  application.listen(port, () => {
      console.log(
          `Lab ANSSI Utilitaires est démarré et écoute sur le port ${port} !…`,
      );
  });
};

export { fabriqueApplication, demarre };
