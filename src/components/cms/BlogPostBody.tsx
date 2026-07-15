'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'

type BlogPostBodyProps = {
  contentHtml?: string
  body?: Record<string, unknown> | null
}

export function BlogPostBody({ contentHtml, body }: BlogPostBodyProps) {
  if (body && typeof body === 'object' && 'root' in body) {
    return (
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2 prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline">
        <RichText data={body as never} />
      </div>
    )
  }

  if (contentHtml) {
    return (
      <div
        className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-li:mb-2 prose-strong:text-foreground prose-a:text-accent hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    )
  }

  return <p className="text-muted-foreground">Conținut indisponibil momentan.</p>
}
