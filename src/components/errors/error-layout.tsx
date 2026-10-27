type ErrorLayoutProps = {
  code: string
  title: string
  description: string
  children?: React.ReactNode
}

export function ErrorLayout({
  code,
  title,
  description,
  children,
}: ErrorLayoutProps) {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-4xl font-semibold">{code}</p>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-sm text-xs/relaxed text-muted-foreground">
        {description}
      </p>
      <div className="flex gap-2">{children}</div>
    </main>
  )
}
