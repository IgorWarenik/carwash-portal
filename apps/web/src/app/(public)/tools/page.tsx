import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Калькуляторы для автомойки — окупаемость, оценка, локация',
  description:
    'Бесплатные онлайн-калькуляторы: рассчитайте окупаемость автомойки, ' +
    'оцените бизнес или выберите локацию.',
  alternates: { canonical: '/tools' },
}

const tools = [
  {
    href: '/tools/kalkulyator-okupaemosti',
    title: 'Калькулятор окупаемости',
    description: 'Рассчитайте срок окупаемости и доходность вашей автомойки',
  },
  {
    href: '/tools/kalkulyator-ocenki-avtomoyki',
    title: 'Оценка автомойки',
    description: 'Узнайте рыночную стоимость автомойки как бизнеса',
  },
  {
    href: '/tools/ocenka-lokacii',
    title: 'Оценка локации',
    description: 'Wizard: выберите лучшее место для открытия автомойки',
  },
]

export default function ToolsPage() {
  return (
    <main>
      <h1>Онлайн-инструменты для автомойки</h1>
      <div>
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
