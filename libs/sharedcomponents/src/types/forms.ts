import { UseFormReturn, FieldValues, FieldErrors } from 'react-hook-form';

export type FormAPI<T extends FieldValues> = Omit<UseFormReturn<T>, 'trigger' | 'handleSubmit'> & {
    errors: FieldErrors<T>;
};
