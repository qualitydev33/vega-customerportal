import React, { ReactNode } from 'react';
import { ContainerType } from '@vegaplatformui/models';

export const ContainerTypeFormatter = (containerType: ContainerType) => {
    //Replace the underlines with spaces
    const spacedContainer = containerType.replace('_', ' ');
    //Take each letter at the beginning or after a space and to upper case it
    return spacedContainer.replace(/\b\w/g, (x) => x.toUpperCase());
};
