import {fabriqueApplication, demarre} from "./serveur";
import {port} from "./adaptateurEnvironnement";
import {recupereConfiguration} from "./configuration";

const configuration = recupereConfiguration(process.env);
const application = fabriqueApplication(configuration);
demarre(application, port);
