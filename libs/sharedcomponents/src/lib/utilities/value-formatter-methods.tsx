export const FormatNumberUSDHundredth = (param: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2, // will print $2500.10 or $10.00
    }).format(param);
};

export const FormattedNumberString = (param: number, minimumFractionDigits = 0) => {
    // format number to string with a language-sensitive representation
    return param.toLocaleString(undefined, {
        minimumFractionDigits: minimumFractionDigits
    }); // will print 25,346,783
};

export const ReverseFormattedNumberString = (param: string) => {
    // convert the string to number
    return Number(param.replace(/,/g, '')); // will print 25346783
};

export const cutDecimals = (param: number, decimals: number) => {
    const factor = 10 ** decimals;
    return Math.floor(param * factor) / factor;
}