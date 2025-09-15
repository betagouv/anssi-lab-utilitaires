import {describe, expect, it} from "vitest";
import supertest from "supertest";

import {recupereConfiguration} from "../src/configuration";
import {fabriqueApplication} from "../src/serveur";

const webhookIdsPourLesTests = Object.fromEntries([
  "ID_MATTERMOST_MSS_ALERTES_SENTRY",
  "ID_MATTERMOST_MSS_ALERTES_SENTRY",
  "ID_MATTERMOST_MSS_ALERTES_CRISP",
  "ID_MATTERMOST_MSS_ALERTES_GITHUB_ACTION",
  "ID_MATTERMOST_MSS_ALERTES_GITHUB_PULL_REQUEST_OUVERTE",
  "ID_MATTERMOST_MSS_ALERTES_GITHUB_PULL_REQUEST_APPROUVEE",
  "ID_MATTERMOST_MSS_ALERTES_GITHUB_PULL_REQUEST_MERGEE",
  "ID_MATTERMOST_MAC_ALERTES_SENTRY",
  "ID_MATTERMOST_MAC_ALERTES_BREVO",
  "ID_MATTERMOST_WEBHOOK_MAC_GITHUB",
  "ID_MATTERMOST_WEBHOOK_MAC_GITHUB",
  "ID_MATTERMOST_WEBHOOK_MAC_GITHUB",
  "ID_MATTERMOST_WEBHOOK_MAC_GITHUB",
  "ID_MATTERMOST_MAC_ALERTES_CRISP",
  "ID_MATTERMOST_NIS2_ALERTES_CRISP",
  "ID_MATTERMOST_MSC_ALERTES_SENTRY",
  "ID_MATTERMOST_MSC_ALERTES_CRISP",
  "ID_MATTERMOST_LAB_ANSSI_GITHUB_ACTION",
  "ID_MATTERMOST_UI_KIT_GITHUB_RELEASE",
  "ID_MATTERMOST_LAB_ANSSI_LIB_GITHUB_RELEASE",
  ].map((v) => [v, process.env[`valeur pour la variable ${v}`]])) as Record<string, string>;

const defaultConfiguration = recupereConfiguration(webhookIdsPourLesTests);
const defaultApp = fabriqueApplication(defaultConfiguration)

describe("l'API de l'application", () => {
    it("n'a pas de ressource racine", async () => {
        const reponse = await supertest(defaultApp).get('/');
        expect(reponse.status).to.equal(404);
    });

    describe("sur routes utilisés par les webhooks", () => {
        describe("sans validateur par défaut", () => {
            const webhooksSansValidateur = defaultConfiguration.services
                .filter((s) => !("validateur" in s.configuration));

            webhooksSansValidateur.map((s) => s.id).forEach((w) => {
                const routeWebhook = `/webhooks/${w}`;

                it(`rejette les requêtes sur ${routeWebhook}`, async () => {
                    const reponse = await supertest(defaultApp).post(routeWebhook);
                    expect(reponse.status).to.equal(401);
                });
            });
        });
    });
});
