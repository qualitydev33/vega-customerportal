export enum ContactSupportTopic {
    Billing = 'Billing',
    Tech = 'Tech',
    CloudHero = 'Cloud Hero',
}

export type ContactSupportForm = {
    topic: ContactSupportTopic;
    firstName: string;
    lastName: string;
    email: string;
    feedback: string;
    subject: string;
};
