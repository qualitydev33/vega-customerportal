export interface ISendSupportEmailRequest {
    first_name: string;
    last_name: string;
    email: string;
    topic: string;
    subject: string;
    message: string;
}

export enum SupportEmailRecipient {
    CloudHero = 'cloudHero',
    Support = 'support',
}
