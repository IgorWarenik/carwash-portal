'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Option { label: string; value: number; hint?: string }

interface Step {
  id: string
  title: string
  description: string
  icon: string
  maxScore: number
  options: Option[]
}

const STEPS: Step[] = [
  {
    id: 'traffic',
    title: 'Трафик',
    description: 'Сколько машин проезжает мимо точки в день?',
    icon: '🚗',
    maxScore: 30,
    options: [
      { label: 'Более 10 000 авт/день', value: 30, hint: 'Трасса, крупная магистраль' },
      { label: '5 000–10 000 авт/день', value: 22, hint: 'Оживлённая городская улица' },
      { label: '2 000–5 000 авт/день', value: 14, hint: 'Средняя улица, жилой квартал' },
      { label: 'Менее 2 000 авт/день', value: 5, hint: 'Тихий район, тупик' },
    ],
  },
  {
    id: 'visibility',
    title: 'Видимость',
    description: 'Насколько хорошо точку видно с дороги?',
    icon: '👁️',
    maxScore: 25,
    options: [
      { label: 'Отличная: видно издалека, есть въезд', value: 25, hint: 'Угловое место, перекрёсток' },
      { label: 'Хорошая: видно с дороги, прямой въезд', value: 18 },
      { label: 'Средняя: нужно знать где искать', value: 10, hint: 'Двор, знак нужен' },
      { label: 'Плохая: скрыта, без вывески не найти', value: 3 },
    ],
  },
  {
    id: 'competition',
    title: 'Конкуренция',
    description: 'Ближайший конкурент — такого же формата',
    icon: '⚔️',
    maxScore: 20,
    options: [
      { label: 'Нет конкурентов в 1 км', value: 20 },
      { label: 'Конкурент на расстоянии 500 м — 1 км', value: 14 },
      { label: 'Конкурент в 200–500 м', value: 7 },
      { label: 'Конкурент ближе 200 м', value: 2 },
    ],
  },
  {
    id: 'infrastructure',
    title: 'Коммуникации',
    description: 'Доступность воды, электричества и канализации',
    icon: '⚡',
    maxScore: 15,
    options: [
      { label: 'Всё подключено или рядом на участке', value: 15 },
      { label: 'Вода и электричество есть, канализация — нет', value: 10, hint: 'Нужна система очистки' },
      { label: 'Только электричество, воду надо тянуть', value: 5 },
      { label: 'Ничего нет, всё прокладывать с нуля', value: 1 },
    ],
  },
  {
    id: 'lease',
    title: 'Аренда / земля',
    description: 'Условия владения или аренды участка',
    icon: '📋',
    maxScore: 10,
    options: [
      { label: 'Земля в собственности', value: 10 },
      { label: 'Аренда на 10+ лет с правом выкупа', value: 8 },
      { label: 'Аренда на 5–10 лет', value: 5 },
      { label: 'Аренда на 1–3 года без гарантий', value: 1, hint: 'Высокий риск' },
    ],
  },
]

const TOTAL_MAX = STEPS.reduce((sum, s) => sum + s.maxScore, 0) // 100

function getVerdict(score: number): { label: string; color: string; bg: string; advice: string } {
  if (score >= 80) return {
    label: 'Отличная локация',
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    advice: 'По всем ключевым параметрам место подходит для открытия автомойки. Переходите к расчёту инвестиций.',
  }
  if (score >= 60) return {
    label: 'Хорошая локация',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    advice: 'Место перспективное. Устраните слабые стороны: улучшите видимость вывеской, проверьте условия аренды.',
  }
  if (score >= 40) return {
    label: 'Рискованная локация',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50 border-yellow-200',
    advice: 'Есть серьёзные ограничения. Рассмотрите альтернативные точки или формат с меньшими инвестициями (МСО вместо ручной).',
  }
  return {
    label: 'Плохая локация',
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    advice: 'Высокий риск убытков. Не открывайте здесь мойку без кардинального улучшения хотя бы двух критериев.',
  }
}

export function OcenkaLokaciiClient() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [currentStep, setCurrentStep] = useState(0)

  const isDone = Object.keys(answers).length === STEPS.length
  const totalScore = Object.values(answers).reduce((s, v) => s + v, 0)
  const pct = Math.round((totalScore / TOTAL_MAX) * 100)
  const verdict = getVerdict(pct)

  function select(stepId: string, value: number) {
    setAnswers((prev) => ({ ...prev, [stepId]: value }))
    if (currentStep < STEPS.length - 1) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300)
    }
  }

  function reset() {
    setAnswers({})
    setCurrentStep(0)
  }

  const step = STEPS[currentStep]

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Шаг {Math.min(currentStep + 1, STEPS.length)} из {STEPS.length}</span>
          {isDone && <button onClick={reset} className="text-[#e94560] hover:underline text-sm">Начать заново</button>}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e94560] rounded-full transition-all duration-500"
            style={{ width: `${(Object.keys(answers).length / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex mt-2 gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                answers[s.id] !== undefined ? 'bg-[#e94560]' : i === currentStep ? 'bg-gray-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step card */}
      {!isDone && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{step.icon}</span>
            <div>
              <h2 className="font-bold text-lg">{step.title}</h2>
              <p className="text-xs text-gray-400">Вес критерия: {step.maxScore} баллов из {TOTAL_MAX}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-5">{step.description}</p>

          <div className="space-y-2">
            {step.options.map((opt) => {
              const selected = answers[step.id] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => select(step.id, opt.value)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all ${
                    selected
                      ? 'border-[#e94560] bg-[#e94560]/5 text-gray-900'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{opt.label}</span>
                      {opt.hint && <div className="text-xs text-gray-400 mt-0.5">{opt.hint}</div>}
                    </div>
                    <span className={`text-sm font-bold ml-4 flex-shrink-0 ${selected ? 'text-[#e94560]' : 'text-gray-400'}`}>
                      {opt.value} б.
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-3 mt-6">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((s) => s - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                ← Назад
              </button>
            )}
            {answers[step.id] !== undefined && currentStep < STEPS.length - 1 && (
              <button
                onClick={() => setCurrentStep((s) => s + 1)}
                className="px-4 py-2 text-sm font-medium text-white bg-[#e94560] rounded-lg hover:bg-[#c73652]"
              >
                Далее →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {isDone && (
        <div className="space-y-4">
          {/* Score card */}
          <div className="bg-[#1a1a2e] text-white rounded-2xl p-6 text-center">
            <p className="text-gray-400 text-sm mb-2">Итоговый балл</p>
            <div className="text-6xl font-bold text-[#e94560] mb-1">{pct}</div>
            <p className="text-gray-400 text-sm mb-4">из 100 возможных</p>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mx-auto max-w-xs">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: pct >= 80 ? '#22c55e' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Verdict */}
          <div className={`border rounded-2xl p-5 ${verdict.bg}`}>
            <h3 className={`font-bold text-lg mb-2 ${verdict.color}`}>{verdict.label}</h3>
            <p className="text-gray-700 text-sm">{verdict.advice}</p>
          </div>

          {/* Breakdown */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Детализация по критериям</h3>
            <div className="space-y-3">
              {STEPS.map((s) => {
                const score = answers[s.id] ?? 0
                const stepPct = Math.round((score / s.maxScore) * 100)
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{s.icon} {s.title}</span>
                      <span className="font-semibold">{score} / {s.maxScore}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${stepPct}%`,
                          background: stepPct >= 80 ? '#22c55e' : stepPct >= 50 ? '#3b82f6' : '#f59e0b',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/tools/roi-calculator"
              className="flex items-center gap-3 bg-[#e94560] text-white rounded-xl p-4 hover:bg-[#c73652] transition-colors"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-sm">Калькулятор ROI</div>
                <div className="text-xs text-white/70">Рассчитайте окупаемость</div>
              </div>
            </Link>
            <Link
              href="/blog/kak-vibrat-lokaciyu-dlya-avtomoiki"
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-semibold text-sm text-gray-900">Гайд по локациям</div>
                <div className="text-xs text-gray-400">7 критериев с примерами</div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
