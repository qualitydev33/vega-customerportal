import React, { FC } from 'react';
import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FormattedNumberString, ReverseFormattedNumberString, cutDecimals } from './value-formatter-methods';
import { regexList } from '@vegaplatformui/utils';


interface BudgetTextFieldValidationProps {
  value: number,
  message: string,
}
interface BudgetTextFieldProps extends StandardTextFieldProps {
  currencySymbol?: string;
  decimalPlaces?: number;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  max?: BudgetTextFieldValidationProps | null;
  min?: BudgetTextFieldValidationProps | null;
}

const BudgetTextField: FC<BudgetTextFieldProps> = ({
  currencySymbol = '$',
  decimalPlaces = 2,
  register,
  setValue,
  max,
  min,
  ...rest
}) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = event.target.value;
    const fieldName = rest.name ?? 'budget';

    if (fieldValue[fieldValue.length - 1] === '.' && fieldValue.split('').filter(x => x === '.').length === 1) {
      return;
    }
    
    const numericValue = parseFloat(fieldValue.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericValue)) {
      setValue(fieldName, FormattedNumberString(cutDecimals(numericValue, decimalPlaces)));
    }
    else setValue(fieldName, '0');
  };

  return (
    <TextField
      {...register(rest.name ?? 'budget', {
        onChange: handleChange,
        required: { value: true, message: 'Required' },
        validate: (budget: string) => {
          if (!budget.match(regexList.formatted_number_str)) {
            return 'Invalid budget format.'
          }
          if (max && ReverseFormattedNumberString(budget) > max?.value) {
            return max.message;
          }
          if (min && ReverseFormattedNumberString(budget) > min.value) {
            return min.message;
          }
        },
      })}
      InputProps={{
        startAdornment: currencySymbol,
      }}
      {...rest}
    />
  );
};

export { BudgetTextField };