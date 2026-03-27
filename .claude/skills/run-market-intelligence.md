# Skill: run-market-intelligence

Запускает полный цикл рыночной разведки: рынок + конкуренты + тренды → продуктовая стратегия.

## Запуск

```bash
npm run agents -- --agent=intel-orchestrator
```

## Что делают агенты

| Агент | Задача | Выход |
|-------|--------|-------|
| `intel-orchestrator` | Координирует всю команду | `docs/MARKET_INTELLIGENCE_<дата>.md` |
| `intel-market-researcher` | Размер рынка, сегменты, экономика | `docs/intel/market-research.md` |
| `intel-competitor-monitor` | Анализ конкурентов, gaps | `docs/intel/competitor-analysis.md` |
| `intel-trend-analyst` | Тренды, сезонность, emerging patterns | `docs/intel/trend-analysis.md` |
| `intel-strategy-builder` | Синтез → продуктовая стратегия | `docs/PRODUCT_STRATEGY_<дата>.md` |

## Запуск отдельных агентов

```bash
# Только исследование рынка
npm run agents -- --agent=intel-market-researcher

# Только конкуренты
npm run agents -- --agent=intel-competitor-monitor

# Только тренды
npm run agents -- --agent=intel-trend-analyst

# Только стратегия (нужны готовые docs/intel/*.md)
npm run agents -- --agent=intel-strategy-builder
```

## Периодичность

Рекомендуется запускать:
- `intel-market-researcher` — раз в квартал
- `intel-competitor-monitor` — раз в месяц
- `intel-trend-analyst` — раз в месяц
- Полный цикл (`intel-orchestrator`) — раз в квартал перед планированием

## Выходные документы

После запуска проверь:
- `docs/intel/market-research.md` — данные по рынку
- `docs/intel/competitor-analysis.md` — карта конкурентов
- `docs/intel/trend-analysis.md` — тренды
- `docs/PRODUCT_STRATEGY_<дата>.md` — финальная стратегия
