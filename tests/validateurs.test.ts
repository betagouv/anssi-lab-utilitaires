import {describe, expect, it} from "vitest";
import type { Request } from "../src/validateurs";

import { fabriqueValidateurDeRequeteGitHub } from "../src/validateurs/github";

describe('le validateur de requetes GitHub', () => {
    const bonSecret = "choucroute";
    const bonCorps = "{}";
    const bonnesEntetes = {
        "x-hub-signature-256": "sha256=16d0099693d39c489aa64396b263f299df7377cebd3e6d4eb5fd80ea5e293c52",
    };

    const mockCorps = (corps: string) => ({ toString: () => corps });

    const bonneRequete = { headers: bonnesEntetes, body: mockCorps(bonCorps) } as any as Request;

    it('valide une requête contenant les bonnes données connaissant le bon secret', async () => {
        const validateurDeRequeteGitHub = fabriqueValidateurDeRequeteGitHub(bonSecret);

        const resultat = await validateurDeRequeteGitHub(bonneRequete);

        expect(resultat).to.be.true;
    });

    it('ne valide pas une requête contenant les bonnes données avec le mauvais secret', async () => {
        const validateurDeRequeteGitHub = fabriqueValidateurDeRequeteGitHub("pas le bon secret");

        const resultat = await validateurDeRequeteGitHub(bonneRequete);

        expect(resultat).to.be.false;
    });

    it('ne valide pas une requête ne contenant pas la signature dans ses entêtes', async() => {
        const validateurDeRequeteGitHub = fabriqueValidateurDeRequeteGitHub(bonSecret);

        const mauvaiseRequete = { headers: {}, body: mockCorps(bonCorps) } as any as Request;
        const resultat = await validateurDeRequeteGitHub(mauvaiseRequete);

        expect(resultat).to.be.false;
    });

    it('ne valide pas une requête contenant une mauvaise signature dans ses entêtes', async() => {
        const validateurDeRequeteGitHub = fabriqueValidateurDeRequeteGitHub(bonSecret);

        const mauvaiseRequete = { headers: { "x-hub-signature-256": "signature modifiée" }, body: mockCorps(bonCorps) } as any as Request;
        const resultat = await validateurDeRequeteGitHub(mauvaiseRequete);

        expect(resultat).to.be.false;
    });

    it('ne valide pas une requête contenant les mauvaises données connaissant le bon secret', async () => {
        const validateurDeRequeteGitHub = fabriqueValidateurDeRequeteGitHub(bonSecret);

        const mauvaiseRequete = { headers: bonnesEntetes, body: mockCorps("données modifiées") } as any as Request;
        const resultat = await validateurDeRequeteGitHub(mauvaiseRequete)

        expect(resultat).to.be.false;
    });
});
