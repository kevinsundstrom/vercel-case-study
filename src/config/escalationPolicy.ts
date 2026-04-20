export interface EscalationPolicy {
  /** Abort the run and surface to a human when any of these conditions are met. */
  abortConditions: AbortCondition[];
  /** Notification targets when escalating (stub — not connected yet). */
  notifyChannels: string[];
}

export interface AbortCondition {
  id: string;
  description: string;
  /** The check that triggers this condition. Evaluated by finalizeRun. */
  triggerExpression: string;
}

export const escalationPolicy: EscalationPolicy = {
  abortConditions: [
    {
      id: 'max_repair_iterations_exceeded',
      description: 'Repair loop has run the maximum number of iterations without passing.',
      triggerExpression: 'repairIterations >= repairPolicy.maxIterations && !passed',
    },
    {
      id: 'verification_errors_after_repair',
      description: 'Error-severity verification issues remain after all repair attempts.',
      triggerExpression: 'verificationReport.issues.some(i => i.severity === "error")',
    },
    {
      id: 'lint_errors_after_repair',
      description: 'Error-severity lint issues remain after all repair attempts.',
      triggerExpression: 'lintReport.issues.some(i => i.severity === "error")',
    },
    {
      id: 'empty_claim_ledger',
      description: 'ClaimLedger has no claims — evidence extraction likely failed.',
      triggerExpression: 'claimLedger.claims.length === 0',
    },
  ],
  notifyChannels: [
    // TODO: connect to Slack, email, or other channel
  ],
};
