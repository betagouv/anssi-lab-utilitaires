import type { NextFunction, Request as ExpressRequest, Response } from "express";

export type Request = ExpressRequest & { body: { toString: () => string } };

export type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export type Validateur = (requete: Request) => Promise<boolean>;

type FabriqueMiddleware = (valide: Validateur) => ExpressMiddleware;
type RecupereValidateur = () => ExpressMiddleware;
type SelectionneValidateur = () => Validateur;

const selectionValidateurDeRequete: SelectionneValidateur = () => {
    // Sécurité par défaut : on rejette si aucun validateur n'est déclaré.
    return (_) => Promise.resolve(false);
}

const fabriqueValidateurDeRequete: FabriqueMiddleware = (valide) => {
    return async (requete: Request, reponse: Response, suivant: NextFunction) => {
        if (!(await valide(requete))) {
            reponse.status(401).send("Unauthorized");
            return;
        }

        suivant()
    };
}

export const recupereValidateurDeRequete: RecupereValidateur = () => fabriqueValidateurDeRequete(selectionValidateurDeRequete());
