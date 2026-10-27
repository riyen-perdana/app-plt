import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { ErrorLayout } from "@/components/errors/error-layout"

export function NotFound() {
  return (
    <ErrorLayout
      code="404"
      title="Halaman tidak ditemukan"
      description="Alamat yang Anda buka tidak ada atau sudah dipindahkan."
    >
      <Button asChild>
        <Link to="/">Ke beranda</Link>
      </Button>
    </ErrorLayout>
  )
}
