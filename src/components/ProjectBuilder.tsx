import { useState } from 'react'
import { Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { optionsFor  } from '../features/stack-catalog/catalog'
import type {StackCategory} from '../features/stack-catalog/catalog';
import { compatibilityFor, resetInvalidSelections } from '../features/stack-catalog/compatibility'
import type { ProjectConfiguration } from '../features/projects/schema'

const steps = [
  ['project', 'Project'], ['frontend', 'Frontend'], ['backend', 'Backend'], ['database', 'Database'], ['ui', 'UI'], ['integrations', 'Integrations'], ['review', 'Review'],
] as const

type Props = { initial?: Partial<ProjectConfiguration>; onSave: (config: ProjectConfiguration) => Promise<void>; saveLabel: string }
const empty: Partial<ProjectConfiguration> = { integrations: [] }

export function ProjectBuilder({ initial = empty, onSave, saveLabel }: Props) {
  const [draft, setDraft] = useState<Partial<ProjectConfiguration>>({ ...empty, ...initial })
  const [step, setStep] = useState(0)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const current = steps[step][0]
  const update = (key: keyof ProjectConfiguration, value: string | string[]) => {
    const next = { ...draft, [key]: value }
    const reset = resetInvalidSelections(next)
    setDraft(reset.values)
    setNotice(reset.reset.length ? `Changing this selection reset incompatible ${reset.reset.join(', ')} choices.` : '')
  }
  const canContinue = () => current === 'project' ? Boolean(draft.name?.trim()) : current === 'integrations' || current === 'review' || Boolean(draft[current as keyof ProjectConfiguration])
  const submit = async () => {
    const required = ['name', 'frontend', 'backend', 'database', 'ui'] as const
    if (required.some((key) => !draft[key])) { setNotice('Complete every required selection before saving.'); setStep(0); return }
    setSaving(true); setNotice('')
    try { await onSave({ ...(draft as ProjectConfiguration), integrations: draft.integrations ?? [] }) } catch (error) { setNotice(error instanceof Error ? error.message : 'Unable to save project. Try again.') } finally { setSaving(false) }
  }
  const reset = () => { if (window.confirm('Reset this project configuration?')) { setDraft(empty); setStep(0); setNotice('Project configuration reset.') } }
  return <div className="builder">
    <aside className="steps" aria-label="Project setup steps">{steps.map(([id, label], index) => <button type="button" key={id} className={index === step ? 'step active' : 'step'} onClick={() => setStep(index)}><span>{index < step ? <Check size={14} /> : index + 1}</span>{label}</button>)}</aside>
    <section className="builder-content">
      <div className="builder-heading"><p className="eyebrow">Step {step + 1} of {steps.length}</p><h1>{steps[step][1]}</h1>{notice && <p role="status" className="notice">{notice}</p>}</div>
      {current === 'project' && <div className="field-group"><label htmlFor="name">Project name <em>*</em></label><input id="name" maxLength={144} value={draft.name ?? ''} onChange={(event) => update('name', event.target.value)} placeholder="Acme customer portal" autoFocus /><label htmlFor="description">Description</label><textarea id="description" maxLength={2000} value={draft.description ?? ''} onChange={(event) => update('description', event.target.value)} placeholder="What are you building and for whom?" /></div>}
      {(['frontend', 'backend', 'database', 'ui'] as const).includes(current as never) && <Options category={current as StackCategory} draft={draft} onSelect={(slug) => update(current as keyof ProjectConfiguration, slug)} />}
      {current === 'integrations' && <div className="option-grid">{optionsFor('integration').map((option) => { const selected = draft.integrations?.includes(option.slug); return <button type="button" className={`option-card ${selected ? 'selected' : ''}`} key={option.slug} onClick={() => update('integrations', selected ? (draft.integrations ?? []).filter((item) => item !== option.slug) : [...(draft.integrations ?? []), option.slug])}><span className="check">{selected && <Check size={15} />}</span><strong>{option.name}</strong><p>{option.description}</p><small>{option.details}</small></button>})}</div>}
      {current === 'review' && <Review draft={draft} />}
      <footer className="builder-actions"><button type="button" className="button ghost" onClick={reset}><RotateCcw size={16} />Reset</button><span /><button type="button" className="button ghost" disabled={!step} onClick={() => setStep(step - 1)}><ChevronLeft size={16} />Back</button>{current === 'review' ? <button type="button" className="button primary" disabled={saving} onClick={submit}>{saving ? 'Saving…' : saveLabel}</button> : <button type="button" className="button primary" disabled={!canContinue()} onClick={() => setStep(step + 1)}>Continue<ChevronRight size={16} /></button>}</footer>
    </section>
  </div>
}

function Options({ category, draft, onSelect }: { category: StackCategory; draft: Partial<ProjectConfiguration>; onSelect: (slug: string) => void }) {
  return <div className="option-grid">{optionsFor(category).map((option) => { const result = category === 'frontend' ? { valid: true } : compatibilityFor(category as 'backend' | 'database' | 'ui', option.slug, draft); const selected = draft[category as keyof ProjectConfiguration] === option.slug; return <button type="button" key={option.slug} disabled={!result.valid} className={`option-card ${selected ? 'selected' : ''}`} onClick={() => onSelect(option.slug)}><span className="check">{selected && <Check size={15} />}</span><strong>{option.name}</strong><p>{option.description}</p><small>{result.valid ? option.details : result.reason}</small></button> })}</div>
}
function Review({ draft }: { draft: Partial<ProjectConfiguration> }) { return <dl className="review">{(['name', 'description', 'frontend', 'backend', 'database', 'ui'] as const).map((key) => <div key={key}><dt>{key === 'ui' ? 'UI system' : key}</dt><dd>{draft[key] || 'Not selected'}</dd></div>)}<div><dt>integrations</dt><dd>{draft.integrations?.join(', ') || 'None'}</dd></div></dl> }
