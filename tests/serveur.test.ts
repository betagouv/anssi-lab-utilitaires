import {describe, expect, it} from "vitest";
import supertest from "supertest";

import {recupereConfiguration} from "../src/configuration";
import {fabriqueApplication} from "../src/serveur";

const variablesPourLesTests = new Proxy({}, {
  get: (_, nom) => `valeur pour la variable ${String(nom)}`,
}) as Record<string, string>;

const configuration = recupereConfiguration(variablesPourLesTests);
const app = fabriqueApplication(configuration);

describe("l'API de l'application", () => {
    it("n'a pas de ressource racine", async () => {
        const reponse = await supertest(app).get('/');
        expect(reponse.status).to.equal(404);
    });

    it("vérifie comment fonctionne les URL", () => {
      expect(new URL('https://google.fr').toString()).toBe('https://google.fr/')
      expect(new URL('hooks', 'https://google.fr').toString()).toBe('https://google.fr/hooks')
      expect(new URL(`/hooks/${34}`, 'https://google.fr').toString()).toBe('https://google.fr/hooks/34')
    });
});
