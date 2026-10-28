type ErrorLayoutProps = {
  code: string
  title: string
  description: string
  children?: React.ReactNode
  details?: React.ReactNode
}

export function ErrorLayout({
  code,
  title,
  description,
  children,
  details,
}: ErrorLayoutProps) {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-4xl font-semibold">{code}</p>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-sm text-xs/relaxed text-muted-foreground">
        {description}
      </p>
      <div className="flex gap-2">{children}</div>
      {details && (
        <div className="absolute inset-x-0 bottom-0 p-4">{details}</div>
      )}
    </main>
  )
}
