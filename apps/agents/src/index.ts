import { runOrchestrator } from './orchestrator.js'

const task = process.argv.slice(2).join(' ').trim()

if (!task) {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           АГЕНТЫ — ПОРТАЛ АВТОМОЕК                     ║
╠════════════════════════════════════════════════════════╣
║  Агенты:                                               ║
║  • marketer           — анализ рынка и конкурентов     ║
║  • content-architect  — структура данных и контент     ║
║  • ux-designer        — страницы и пользовательский UI ║
║  • frontend-dev       — React компоненты (apps/web/)   ║
║  • backend-dev        — NestJS API (apps/api/)         ║
║  • seo-specialist     — SEO под Яндекс                 ║
╠════════════════════════════════════════════════════════╣
║  Использование:                                        ║
║  npm start -- "<задача>"                               ║
╠════════════════════════════════════════════════════════╣
║  Примеры задач:                                        ║
║  "Исследуй конкурентов и определи функции портала"     ║
║  "Создай карточку автомойки на фронтенде"              ║
║  "Реализуй API для поиска и фильтрации автомоек"       ║
║  "Настрой SEO для страниц каталога"                    ║
╚════════════════════════════════════════════════════════╝
`)
  process.exit(0)
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY не установлен в переменных окружения')
  process.exit(1)
}

runOrchestrator(task).catch((err) => {
  console.error('❌ Ошибка:', err.message)
  process.exit(1)
})
