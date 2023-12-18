import React, { HTMLAttributes } from 'react';
import { DeepPartial, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FormAPI } from '../../types/forms';

interface IFormProps<T extends FieldValues> extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
    defaultValues?: DeepPartial<T>;
    onSubmit: SubmitHandler<T>;
    children: (api: FormAPI<T>) => React.ReactNode;
}

function Form<T extends FieldValues>({ defaultValues, onSubmit, children, ...htmlProps }: IFormProps<T>) {
    const { handleSubmit, trigger, formState, ...rest } = useForm<T>({
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} {...htmlProps}>
            {children({ errors: formState.errors, formState, ...rest })}
        </form>
    );
}

export { Form };
