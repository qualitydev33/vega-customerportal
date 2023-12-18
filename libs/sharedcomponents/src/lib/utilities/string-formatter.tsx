import React from 'react';
import { makeStyles } from '@vegaplatformui/styling';

export const StringCapitalizeAndSpace = (string: string) => {
    //Replace the underlines with spaces
    const spacedString = string.replace('_', ' ');
    //Take each letter at the beginning or after a space and to upper case it
    return spacedString.replace(/\b\w/g, (x) => x.toUpperCase());
};

export const StringLowerCaseAndUnderscore = (string: string) => {
    //Replace the underlines with spaces
    const spacedString = string.replace(' ', '_');
    //Take each letter at the beginning or after a space and to upper case it
    return spacedString.toLowerCase();
};
