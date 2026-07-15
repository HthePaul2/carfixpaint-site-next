import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
  className?: string
  height?: number
  priority?: boolean
  variant?: 'default' | 'onDark'
}

export function BrandLogo({
  className = '',
  height = 36,
  priority = false,
  variant = 'default',
}: BrandLogoProps) {
  const width = Math.round(height * (2172 / 724))

  return (
    <Link href="/" className={`inline-flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <span
        className={
          variant === 'onDark'
            ? 'inline-flex rounded-md bg-white px-2 py-1'
            : 'inline-flex'
        }
      >
        <Image
          src="/logo.svg"
          alt="Car Fix & Paint"
          width={width}
          height={height}
          priority={priority}
          className="h-auto w-auto"
          style={{ height, width: 'auto' }}
        />
      </span>
    </Link>
  )
}
