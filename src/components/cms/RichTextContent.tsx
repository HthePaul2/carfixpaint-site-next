import { RichText } from '@payloadcms/richtext-lexical/react'

type RichTextContentProps = {
  data: Record<string, unknown> | null | undefined
  className?: string
}

export function RichTextContent({ data, className }: RichTextContentProps) {
  if (!data) return null

  return (
    <div className={className}>
      <RichText data={data as never} />
    </div>
  )
}
