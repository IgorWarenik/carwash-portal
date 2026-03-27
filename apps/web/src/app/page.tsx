import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Портал Автомоек — найти, купить, открыть автомойку в России',
  description:
    'Крупнейший портал автомоек России. Каталог автомоек в вашем городе, ' +
    'покупка и продажа бизнеса, поставщики оборудования, франшизы, калькуляторы.',
}

export default function HomePage() {
  return (
    <main>
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Портал Автомоек
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Найти, купить, продать или открыть автомойку в России.
          Каталог, калькуляторы, поставщики, франшизы.
        </p>
      </section>
    </main>
  )
}
