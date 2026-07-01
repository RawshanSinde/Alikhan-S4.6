# Verbatim Prompt Log — SURFS Etherpad Replication Session

## Prompt 1 (initial task prompt)

> Task: improve an existing open-source Etherpad implementation. This is a reproducible research replication. Act deterministically, stay strictly inside the scope below, and do not make product decisions I have not asked for.
> Fixed inputs — do NOT deviate:
> The base repository is ether/etherpad-lite and only that. Clone it exactly as-is:
> git clone https://github.com/ether/etherpad-lite.git ~/etherpad-replication
> Do not pick a different repo, do not rebuild from scratch, and do not start from any other collaborative editor implementation. If the clone exists, use it; do not re-pick.
> Do all work on a branch named improvements created off master. Never commit to master. Every change you make must be visible in git diff master...improvements.
> Preserve the upstream architecture. Maintain Etherpad's existing architecture, collaboration model, server structure, plugin system, and real-time synchronization mechanisms. Do not replace the collaboration engine, rewrite the synchronization logic, or redesign the application's core architecture.
> Put all new functionality behind one new, clearly named module (e.g. src/node/improvements/ or an equivalent location consistent with the repository structure), wired into the existing architecture so the diff against upstream stays minimal and easy to review and document.
> Scope — implement EXACTLY these improvements and nothing else (no speculative features):
> Improve maintainability by refactoring duplicated or overly complex code while preserving existing behavior.
> Improve documentation by adding clear comments and documentation to newly modified code where appropriate, following the existing documentation style.
> Improve modularity by separating newly introduced functionality into the new module while minimizing coupling with the existing architecture.
> Improve security by addressing any clearly identifiable security issues discovered during implementation without changing intended functionality.
> Improve code quality while preserving complete functional compatibility with the original Etherpad implementation.
> Reproducibility: pin exact dependency versions where applicable, document the required runtime environment, and record the exact tool versions used during implementation.
> Constraints (non-negotiable):
> Preserve all existing Etherpad functionality and user workflows.
> Follow the repository's existing code style, typing, packaging, testing, and architectural conventions.
> Match the surrounding code; do not reformat unrelated files.
> Commit in small, logical, reviewable increments with clear messages.
> Do NOT: push to any git remote; delete, move, or overwrite anything outside ~/etherpad-replication; access credentials or private configuration files; modify unrelated projects or repositories.
> Tests (offline only — must run with no external services): extend the existing test suite with unit tests that:
> verify project dependencies install correctly and the application starts successfully;
> verify newly modified functionality behaves as expected;
> verify existing functionality continues to operate correctly after modifications;
> verify invalid inputs produce appropriate error handling without crashing;
> keep any network-dependent end-to-end testing in a separate, opt-in test file, never in the offline suite.
> Validation gate — you are NOT done until ALL of these pass:
> the offline unit suite is green;
> the application starts successfully without errors;
> newly introduced functionality behaves correctly;
> existing functionality remains unchanged;
> invalid inputs produce appropriate error messages without crashing;
> the full change set is reviewable via git diff master...improvements and is confined primarily to the new module plus minimal wiring.
> If you use multiple agents: you may run an understand → design → implement → adversarial-review pipeline, but every review finding must be independently verified as real before it is fixed (reviewers hallucinate). Otherwise work solo. Either way, do not expand the scope above.
> Deliverables, written to ~/SURFS-Etherpad-Replication/:
> the improved fork on the improvements branch (live checkout stays at ~/etherpad-replication);
> in tasks/: a short, methodology-ready report — what changed, commit list, the git diff master...improvements summary, test results (paste real output), and the exact tool versions used;
> in tasks/: a verbatim, in-order log of every prompt I send you this session.
> Begin by cloning the fixed repository and reading it end to end. Do not start writing code until you have mapped the existing architecture and can state, in one paragraph, exactly where your new module hooks into the system. Report that paragraph, then proceed.

---

## Prompt 2 (continuation after timeout)

> hello can you continue from where it timed out
