import {fabriqueApplication, demarre} from "./serveur";
import {port, webhookIds} from "./adaptateurEnvironnement";
import {recupereConfiguration} from "./configuration";

const configuration = recupereConfiguration(webhookIds);
const application = fabriqueApplication(configuration);
demarre(application, port);
