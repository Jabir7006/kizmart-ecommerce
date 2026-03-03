import { FormProvider, useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: useForm<T>;
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  id,
  className,
}: FormProps<T>) => {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
};
