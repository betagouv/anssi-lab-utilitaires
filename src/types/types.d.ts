export type Configuration = {
    services: Service[];
}

type Service = {
    id: string;
    type: TypeService;
    configuration: ConfigurationService;
}

type ConfigurationService = ConfigurationRedirectionWebhook;

type ConfigurationRedirectionWebhook = {
    idWebhookMattermost: string;
    formatage: string;
}

type TypeService = 'redirectionWebhook';