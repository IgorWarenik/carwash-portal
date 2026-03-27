import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Как открыть автомойку с нуля — пошаговое руководство 2025',
  description:
    'Всё об открытии автомойки: бизнес-план, инвестиции, документы, поставщики оборудования. ' +
    'Калькулятор окупаемости. Консультация эксперта бесплатно.',
  alternates: { canonical: '/otkryt-avtomoiku' },
}

export default function OpenCarwashPage() {
  return (
    <main>
      <section>
        <h1>Как открыть автомойку в 2025 году</h1>
        <p>
          Полное руководство по открытию автомойки: типы бизнеса,
          инвестиции, окупаемость, выбор локации и оборудования.
        </p>
        {/* TODO: LeadForm type="OPEN" */}
        {/* TODO: Секции: типы моек, инвестиции, шаги */}
        {/* TODO: Калькулятор окупаемости CTA */}
      </section>
    </main>
  )
}
