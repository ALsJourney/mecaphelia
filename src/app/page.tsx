import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
             <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
                M
              </div>
              <span className="text-xl font-semibold tracking-tight">mecaphelia</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funktionen
              </Link>
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Vorteile
              </Link>
              <Link href="/sign-in">
                <Button variant="default" className="bg-black text-primary-foreground hover:bg-primary/90">
                  Jetzt starten
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 py-32 lg:px-8 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold tracking-tight text-balance lg:text-6xl">
              Behalte den Überblick über deine Fahrzeuge.
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-gray-600 text-pretty">
              Nie wieder vergessen, was mit deinem Auto nicht stimmt. mecaphelia hilft dir, alle Probleme, Wartungen und
              Reparaturen deiner Fahrzeuge an einem Ort zu verwalten. <br /> <br /> Open Source. Kostenlos.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link href="/sign-in">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Kostenlos beginnen
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
              className="border-border text-foreground hover:bg-accent bg-transparent"
              >
                Mehr erfahren
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img src="/modern-car-dashboard-interface-minimal-clean.jpg" alt="mecaphelia Dashboard" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
     <section id="features" className="border-t border-border bg-muted/50 py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
           <h2 className="text-4xl font-bold tracking-tight text-balance">Alles, was du brauchst</h2>
         <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Verwalte mehrere Fahrzeuge, dokumentiere Probleme und behalte den Überblick über Wartungsintervalle.
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-5xl gap-12 lg:grid-cols-3">
            <div className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-background">
                <CheckCircle2 className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Problemverfolgung</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Dokumentiere alle Probleme und Defekte deiner Fahrzeuge mit Fotos, Beschreibungen und Prioritäten.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-background">
                <CheckCircle2 className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Wartungsplanung</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Erhalte Erinnerungen für anstehende Inspektionen, TÜV-Termine und regelmäßige Wartungsarbeiten.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-300 bg-background">
                <CheckCircle2 className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Mehrere Fahrzeuge</h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Verwalte beliebig viele Autos, Motorräder oder andere Fahrzeuge in einer übersichtlichen Oberfläche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-32">
            <div className="aspect-4/3 overflow-hidden rounded-lg border border-border bg-muted">
              <img src="/car-maintenance-checklist-minimal-interface.jpg" alt="Wartungscheckliste" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-bold tracking-tight text-balance">Spare Zeit und Geld</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
                Mit mecaphelia vergisst du keine wichtigen Reparaturen mehr. Kleine Probleme werden erkannt, bevor sie
                zu teuren Schäden werden. Behalte die Kontrolle über deine Fahrzeugflotte.
              </p>
              <ul className="mt-10 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-foreground" />
                  <span className="leading-relaxed text-gray-600">Keine vergessenen Wartungstermine mehr</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-foreground" />
                  <span className="leading-relaxed text-gray-600">Vollständige Historie aller Reparaturen</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-foreground" />
                  <span className="leading-relaxed text-gray-600">Einfacher Zugriff von überall</span>
                </li>
              </ul>
            </div>
          </div>
      </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold tracking-tight text-balance lg:text-5xl">
            Bereit, deine Fahrzeuge zu verwalten?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-pretty">
            Starte jetzt kostenlos und behalte den Überblick über alle deine Autos.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/sign-in">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">                
              Kostenlos starten
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-background py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
                M
              </div>
              <span className="text-sm font-semibold">mecaphelia</span>
            </div>
            <p className="text-sm text-gray-500">© 2025 mecaphelia. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}