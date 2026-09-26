import { Button } from "@/shared/components/Button";
import { StateLayout } from "@/shared/components/StateLayout";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

export interface ErrorStateProps {
  /** Cualquier error: el texto sale de getErrorMessage (por type, status…). */
  error: unknown;
  onRetry?: () => void | Promise<unknown>;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <StateLayout>
      <Text color="text" align="center" accessibilityRole="alert">
        {getErrorMessage(error)}
      </Text>
      {onRetry ? (
        <Button title={t("common.retry")} variant="secondary" onPress={onRetry} />
      ) : null}
    </StateLayout>
  );
}
