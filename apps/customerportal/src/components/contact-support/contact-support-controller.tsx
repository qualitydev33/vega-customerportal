import React, { useState } from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { ApplicationError, ShowSupportForm, SnackbarErrorOutput, SnackBarOptions, SupportForm } from '@vegaplatformui/sharedcomponents';
import { useKeycloak } from '@react-keycloak-fork/web';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ContactSupportForm, ContactSupportTopic, ISendSupportEmailRequest, SupportEmailRecipient } from '@vegaplatformui/models';
import { VegaApi } from '@vegaplatformui/apis';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IContactSupportControllerProps {
    show: boolean;
}

const ContactSupportController: React.FC<IContactSupportControllerProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const { keycloak } = useKeycloak();
    const [showContactSupport, setShowContactSupport] = useRecoilState(ShowSupportForm);
    const setSnackbarOptions = useSetRecoilState(SnackBarOptions);
    const [applicationError, setApplicationError] = useRecoilState(ApplicationError);
    const [isSending, setIsSending] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string | ContactSupportTopic>('default');
    const vegaApi = new VegaApi();

    const ContactCloudHeroSpecialist = (request: ISendSupportEmailRequest) => {
        vegaApi
            .sendSupportEmail(
                {
                    first_name: request.first_name,
                    last_name: request.last_name,
                    email: request.email,
                    topic: request.topic,
                    message: request.message,
                    subject: request.subject,
                },
                SupportEmailRecipient.CloudHero
            )
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Thank you for contacting a cloud hero specialist!',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem contacting a cloud hero specialist: ${SnackbarErrorOutput(error)}`,
                });
            })
            .finally(() => {
                setIsSending(false);
                setShowContactSupport({ showSupportForm: false, contactType: SupportEmailRecipient.Support });
                setApplicationError(undefined);
            });
    };

    const ContactSupport = (request: ISendSupportEmailRequest) => {
        vegaApi
            .sendSupportEmail(
                {
                    first_name: request.first_name,
                    last_name: request.last_name,
                    email: request.email,
                    topic: request.topic,
                    message: applicationError ? `Current Application Error: ${applicationError}\n\n ${request.message}` : request.message,
                    subject: request.subject,
                },
                SupportEmailRecipient.Support
            )
            .then((response) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'info' },
                    message: 'Thank you for contacting support!',
                });
            })
            .catch((error) => {
                setSnackbarOptions({
                    snackBarProps: { open: true, autoHideDuration: 6000 },
                    alertProps: { severity: 'error' },
                    message: `There was a problem contacting support: ${error}`,
                });
            })
            .finally(() => {
                setIsSending(false);
                setShowContactSupport({ showSupportForm: false, contactType: SupportEmailRecipient.Support });
                setApplicationError(undefined);
                setSelectedTopic('default');
            });
    };

    const onSubmitFeedback = (contactSupportForm: ContactSupportForm) => {
        vegaApi.token = keycloak.token ?? '';
        const contactType = showContactSupport.contactType;
        setIsSending(true);
        switch (contactType) {
            case SupportEmailRecipient.Support:
                ContactSupport({
                    first_name: contactSupportForm.firstName,
                    last_name: contactSupportForm.lastName,
                    email: contactSupportForm.email,
                    topic: contactSupportForm.topic,
                    subject: contactSupportForm.subject,
                    message: contactSupportForm.feedback,
                });
                break;
            case SupportEmailRecipient.CloudHero:
                ContactCloudHeroSpecialist({
                    first_name: contactSupportForm.firstName,
                    last_name: contactSupportForm.lastName,
                    email: contactSupportForm.email,
                    topic: contactSupportForm.topic,
                    subject: contactSupportForm.subject,
                    message: contactSupportForm.feedback,
                });
                break;
        }
    };

    return (
        <SupportForm
            show={showContactSupport.showSupportForm}
            onClose={() => {
                setShowContactSupport({ showSupportForm: false, contactType: SupportEmailRecipient.Support });
                setSelectedTopic('default');
            }}
            isSending={isSending}
            onSubmitFeedback={onSubmitFeedback}
            keycloak={keycloak}
            contactType={showContactSupport.contactType}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
        />
    );
};

const useStyles = makeStyles<IContactSupportControllerProps>()((theme, props) => ({}));

export { ContactSupportController };
