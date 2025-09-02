import {fabriqueApplication, demarre} from "./serveur";
import {port, webhookIds} from "./adaptateurEnvironnement";

const application = fabriqueApplication(webhookIds);
demarre(application, port);
