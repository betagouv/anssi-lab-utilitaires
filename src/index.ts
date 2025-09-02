import {fabriqueApplication, demarre} from "./serveur";

const port = parseInt(process.env.PORT || "") || 3000;

const application = fabriqueApplication();
demarre(application, port);
