import { isAxiosError } from "axios";
import { toast } from "sonner";

/**
 * Shared error handler for mutations.
 */
export const handleMutationError = (error: unknown, defaultMessage: string) => {
  const message = isAxiosError(error)
    ? error.response?.data?.message || error.message || defaultMessage
    : error instanceof Error
      ? error.message
      : defaultMessage;

  toast.error(message);
};
