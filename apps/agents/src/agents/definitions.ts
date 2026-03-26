import { marketer } from './marketer.js'
import { contentArchitect } from './content-architect.js'
import { uxDesigner } from './ux-designer.js'
import { frontendDev } from './frontend-dev.js'
import { backendDev } from './backend-dev.js'
import { seoSpecialist } from './seo-specialist.js'

export const agentDefinitions = {
  marketer,
  'content-architect': contentArchitect,
  'ux-designer': uxDesigner,
  'frontend-dev': frontendDev,
  'backend-dev': backendDev,
  'seo-specialist': seoSpecialist,
} as const

export type AgentName = keyof typeof agentDefinitions
