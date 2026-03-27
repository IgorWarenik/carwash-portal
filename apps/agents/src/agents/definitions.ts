import { marketer } from './marketer.js'
import { contentArchitect } from './content-architect.js'
import { uxDesigner } from './ux-designer.js'
import { frontendDev } from './frontend-dev.js'
import { backendDev } from './backend-dev.js'
import { seoSpecialist } from './seo-specialist.js'
import { employeeOrchestrator } from './employee-orchestrator.js'
import { employeeProductManager } from './employee-product-manager.js'
import { employeeInformationArchitect } from './employee-information-architect.js'
import { employeeSeoStrategist } from './employee-seo-strategist.js'
import { employeeContentSystemsEditor } from './employee-content-systems-editor.js'
import { employeeFrontendEngineer } from './employee-frontend-engineer.js'
import { employeeBackendEngineer } from './employee-backend-engineer.js'
import { employeeDirectorySearchEngineer } from './employee-directory-search-engineer.js'
import { employeeCalculatorEngineer } from './employee-calculator-engineer.js'
import { employeeDataIngestionSpecialist } from './employee-data-ingestion-specialist.js'
import { employeeAnalyticsCroSpecialist } from './employee-analytics-cro-specialist.js'
import { employeeQaSecurityEngineer } from './employee-qa-security-engineer.js'
import { employeeDevopsReleaseEngineer } from './employee-devops-release-engineer.js'
import { intelOrchestrator } from './intel-orchestrator.js'
import { intelMarketResearcher } from './intel-market-researcher.js'
import { intelCompetitorMonitor } from './intel-competitor-monitor.js'
import { intelTrendAnalyst } from './intel-trend-analyst.js'
import { intelStrategyBuilder } from './intel-strategy-builder.js'

export const agentDefinitions = {
  // Phase 1: original agents
  marketer,
  'content-architect': contentArchitect,
  'ux-designer': uxDesigner,
  'frontend-dev': frontendDev,
  'backend-dev': backendDev,
  'seo-specialist': seoSpecialist,
  // Phase 2: employee-agents (CTO mode)
  'employee-orchestrator': employeeOrchestrator,
  'employee-product-manager': employeeProductManager,
  'employee-information-architect': employeeInformationArchitect,
  'employee-seo-strategist': employeeSeoStrategist,
  'employee-content-systems-editor': employeeContentSystemsEditor,
  'employee-frontend-engineer': employeeFrontendEngineer,
  'employee-backend-engineer': employeeBackendEngineer,
  'employee-directory-search-engineer': employeeDirectorySearchEngineer,
  'employee-calculator-engineer': employeeCalculatorEngineer,
  'employee-data-ingestion-specialist': employeeDataIngestionSpecialist,
  'employee-analytics-cro-specialist': employeeAnalyticsCroSpecialist,
  'employee-qa-security-engineer': employeeQaSecurityEngineer,
  'employee-devops-release-engineer': employeeDevopsReleaseEngineer,
  // Phase 3: market intelligence team
  'intel-orchestrator': intelOrchestrator,
  'intel-market-researcher': intelMarketResearcher,
  'intel-competitor-monitor': intelCompetitorMonitor,
  'intel-trend-analyst': intelTrendAnalyst,
  'intel-strategy-builder': intelStrategyBuilder,
} as const

export type AgentName = keyof typeof agentDefinitions
