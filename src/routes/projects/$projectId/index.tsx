import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import ReactMarkdown from 'react-markdown'
import { Copy, Download, Pencil } from 'lucide-react'
import { AppShell } from '../../../components/AppShell'
import { getProject } from '../../../features/projects/server-functions'

export const Route = createFileRoute('/projects/$projectId/')({
  loader: async ({ params }) => {
    const project = await getProject({ data: { projectId: params.projectId } })

    if (!project) {
      throw notFound()
    }

    return project
  },
  component: ProjectDetail,
  notFoundComponent: () => (
    <AppShell>
      <section className="empty">
        <h1>Project not found</h1>
        <Link to="/dashboard">Return to projects</Link>
      </section>
    </AppShell>
  ),
})

function ProjectDetail() {
  const project = Route.useLoaderData()

  const copy = async () => {
    await navigator.clipboard.writeText(project.markdown)
    window.alert('PROJECT.md copied to clipboard.')
  }

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([project.markdown], { type: 'text/markdown;charset=utf-8' }),
    )
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'PROJECT.md'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppShell>
      <div className="page-head">
        <div>
          <p className="eyebrow">Project architecture</p>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className="actions">
          <Link
            className="button ghost"
            to="/projects/$projectId/edit"
            params={{ projectId: project.id }}
          >
            <Pencil size={16} />
            Edit
          </Link>
          <button type="button" className="button primary" onClick={download}>
            <Download size={16} />
            Download PROJECT.md
          </button>
        </div>
      </div>
      <section className="architecture">
        <h2>Architecture</h2>
        <dl className="review">
          <div>
            <dt>frontend</dt>
            <dd>{project.frontend}</dd>
          </div>
          <div>
            <dt>backend</dt>
            <dd>{project.backend}</dd>
          </div>
          <div>
            <dt>database</dt>
            <dd>{project.database}</dd>
          </div>
          <div>
            <dt>UI system</dt>
            <dd>{project.ui}</dd>
          </div>
          <div>
            <dt>integrations</dt>
            <dd>{project.integrations.join(', ') || 'None'}</dd>
          </div>
        </dl>
      </section>
      <section className="markdown">
        <header>
          <div>
            <p className="eyebrow">Generated specification</p>
            <h2>PROJECT.md</h2>
          </div>
          <button type="button" className="button ghost" onClick={copy}>
            <Copy size={16} />
            Copy
          </button>
        </header>
        <article>
          <ReactMarkdown>{project.markdown}</ReactMarkdown>
        </article>
      </section>
    </AppShell>
  )
}
