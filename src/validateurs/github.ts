import { Webhooks } from "@octokit/webhooks";
import type { Validateur } from ".";


/**
* Implémente la validation d'une requête provenant de GitHub à partir d'un secret.
*
* _c.f._ https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries#typescript-example
*/
export const fabriqueValidateurDeRequeteGitHub: (secret: string) => Validateur = (secret) => {
    const webhooks = new Webhooks({ secret });

    return async (requete) => {
        const corps = await requete.body.toString();
        const signature = requete.headers["x-hub-signature-256"] as string;

        if (!signature) {
            return Promise.resolve(false);
        }
        return await webhooks.verify(corps, signature);
    };
};
