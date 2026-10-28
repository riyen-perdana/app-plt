import { Link, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ErrorLayout } from "@/components/errors/error-layout"
import { type ErrorComponentProps } from "@tanstack/react-router"

export function ErrorFallback({ error }: ErrorComponentProps) {
  const router = useRouter()
  return (
    <ErrorLayout
      code="500"
      title="Terjadi kesalahan"
      description="Terjadi kesalahan pada server."
      details={
        import.meta.env.DEV && (
          <pre className="mx-auto max-w-2xl overflow-auto bg-muted p-2 text-left text-xs">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )
      }
    >
      <Button type="button" onClick={() => router.invalidate()}>
        Coba lagi
      </Button>
      <Button asChild>
        <Link to="/">Ke beranda</Link>
      </Button>
    </ErrorLayout>
  )
}
