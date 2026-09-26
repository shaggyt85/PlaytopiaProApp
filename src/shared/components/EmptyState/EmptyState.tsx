import { Button } from "@/shared/components/Button";
import { StateLayout } from "@/shared/components/StateLayout";
import { Text } from "@/shared/components/Text";

export interface EmptyStateProps {
  /** Textos ya traducidos por la pantalla que lo usa. */
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void | Promise<unknown>;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <StateLayout>
      <Text variant="subtitle" align="center">
        {title}
      </Text>
      {message ? (
        <Text color="textSecondary" align="center">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} /> : null}
    </StateLayout>
  );
}
