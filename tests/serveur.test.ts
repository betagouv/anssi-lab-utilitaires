import {describe, expect, it} from "vitest";
import supertest from "supertest";

import {fabriqueApplication} from "../src/serveur.ts";

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

const app = fabriqueApplication(webhookIdsPourLesTests);

describe("l'API de l'application", () => {
    it("n'a pas de ressource racine", async () => {
        const reponse = await supertest(app).get('/');
        expect(reponse.status).to.equal(404);
    });
});
