/**
 * Maps TanStack Form field errors (i18n keys from Valibot schemas)
 * to translated `{ message }` objects expected by `<FieldError />`.
 *
 * @example
 * <FieldError
 *   errors={translateErrors(
 *     field.state.meta.errors,
 *     (key) => t(`validation.${key}`),
 *   )}
 * />
 */
export function translateErrors(
  errors: (string | { message?: string } | undefined)[],
  t: (key: string) => string,
): { message: string }[] {
  return errors
    .map((err) => {
      const key = typeof err === 'string' ? err : err?.message;
      return key ? { message: t(key) } : undefined;
    })
    .filter((e) => e !== undefined);
}
