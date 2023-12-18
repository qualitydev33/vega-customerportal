import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';
import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { useRecoilState } from 'recoil';
import { ShowSupportForm } from '@vegaplatformui/sharedcomponents';
import { SupportEmailRecipient } from '@vegaplatformui/models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICloudHeroesMyRewardsCardProps {
    cardClassName: string;
}

const CloudHeroesMyRewardsCard: React.FC<ICloudHeroesMyRewardsCardProps> = (props) => {
    const { classes, cx } = useStyles(props);
    const [showContactSupport, setShowContactSupport] = useRecoilState(ShowSupportForm);

    return (
        <Card elevation={0} className={cx(props.cardClassName)}>
            <CardHeader
                title={
                    <Typography fontWeight={500} variant={'h6'}>
                        My Rewards
                    </Typography>
                }
            />
            <CardContent>
                <Grid spacing={2} container justifyContent='center' alignItems='center' direction={'column'}>
                    <Grid item xs={12}>
                        <Typography align={'center'}>
                            As you leverage Vega, your rewards are hand-picked and sent directly to the address in your settings. An online
                            marketplace for reward redemption is coming soon.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography align={'center'}>
                            If you have any questions regarding Cloud Hero, please contact Payton Ross, Cloud Hero Specialist.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => setShowContactSupport({ showSupportForm: true, contactType: SupportEmailRecipient.CloudHero })}
                            className={cx(classes.ContactCloudHeroSpecialistButton)}
                            variant={'contained'}
                        >
                            Contact Cloud Hero Specialist
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles<ICloudHeroesMyRewardsCardProps>()((theme, props) => ({
    ContactCloudHeroSpecialistButton: { marginTop: '2rem' },
}));

export { CloudHeroesMyRewardsCard };
