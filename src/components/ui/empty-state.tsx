type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return <p className="text-center text-muted-foreground py-12">{message}</p>
}
