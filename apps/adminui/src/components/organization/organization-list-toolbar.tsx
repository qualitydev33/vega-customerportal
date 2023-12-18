import React from 'react';
import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { NewOrganizationForm } from './new-organization-form';

export interface IOrganizationListToolbarProps extends React.PropsWithChildren {}

const OrganizationListToolbar: React.FC<IOrganizationListToolbarProps> = (props) => {
    const [open, setOpen] = useState(false);

    const handleNewOrgModalOpen = () => {
        setOpen(true);
        console.log('handleNewOrgModalOpen');
    };

    const handleNewOrgModalClose = () => {
        setOpen(false);
    };

    return (
        <Box {...props}>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    m: -1,
                }}
            >
                <Typography sx={{ m: 1 }} variant='h4'>
                    Organizations
                </Typography>
                <Box sx={{ m: 1 }}>
                    <Button color='primary' variant='contained' onClick={handleNewOrgModalOpen}>
                        Add Organization
                    </Button>
                </Box>
            </Box>
            <NewOrganizationForm open={open} onClose={handleNewOrgModalClose} />
        </Box>
    );
};

export { OrganizationListToolbar };
