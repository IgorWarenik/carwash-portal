import { query } from '@anthropic-ai/claude-agent-sdk'
import { agentDefinitions } from './agents/definitions.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '../../..')

const ORCHESTRATOR_PROMPT = `Ты — оркестратор команды разработчиков Портала Автомоек.
Ты координируешь шесть специализированных агентов и самостоятельно читаешь файлы проекта.

ТВОЯ КОМАНДА:
- marketer            — исследует рынок, анализирует конкурентов, определяет требования
- content-architect   — проектирует структуру данных, категории, фильтры, схему Prisma
- ux-designer         — проектирует страницы, пользовательские сценарии, компоненты
- frontend-dev        — пишет React-компоненты и страницы (apps/web/)
- backend-dev         — пишет NestJS-модули и API (apps/api/)
- seo-specialist      — оптимизирует под Яндекс: URL, мета, schema.org

СТРУКТУРА ПРОЕКТА (корень: ${PROJECT_ROOT}):
  apps/
    web/     — Vite + React 18 + TS + Tailwind + Zustand + Framer Motion + tsyringe
    api/     — NestJS 10 + Prisma 5 + PostgreSQL
    agents/  — эта система агентов
  docs/      — документация, создаётся агентами

ПОРЯДОК РАБОТЫ:
1. Получи задачу от пользователя
2. Разбей на подзадачи по зонам ответственности агентов
3. Запускай агентов в правильном порядке (исследование → проектирование → разработка):
   Шаг 1: marketer (если нужно исследование)
   Шаг 2: content-architect (структура данных)
   Шаг 3: ux-designer (страницы и компоненты)
   Шаг 4: backend-dev + frontend-dev (параллельно, если независимо)
   Шаг 5: seo-specialist (финальная оптимизация)
4. Передавай агентам конкретные задачи с контекстом
5. После завершения — суммаризируй результат

ПРАВИЛА:
- Не дублируй работу: каждый агент делает своё
- Если агент написал файл — следующий может его прочитать
- При ошибке — попробуй исправить сам или переформулируй задачу агенту
- Итоговый ответ — на русском языке`

export async function runOrchestrator(task: string): Promise<void> {
  console.log(`\n🚀 Оркестратор запущен\n📋 Задача: ${task}\n${'─'.repeat(60)}\n`)

  for await (const message of query({
    prompt: task,
    options: {
      cwd: PROJECT_ROOT,
      model: 'claude-opus-4-6',
      allowedTools: ['Read', 'Glob', 'Grep', 'Agent'],
      agents: agentDefinitions,
      systemPrompt: ORCHESTRATOR_PROMPT,
      maxTurns: 80,
    },
  })) {
    if ('result' in message) {
      console.log('\n' + '═'.repeat(60))
      console.log('✅ РЕЗУЛЬТАТ:\n')
      console.log(message.result)
      console.log('═'.repeat(60) + '\n')
    } else if (
      message.type === 'assistant' &&
      Array.isArray((message as any).message?.content)
    ) {
      for (const block of (message as any).message.content) {
        if (block.type === 'text' && block.text) {
          process.stdout.write(block.text)
        }
      }
    }
  }
}
