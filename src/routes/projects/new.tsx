import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AppShell } from '../../components/AppShell'
import { ProjectBuilder } from '../../components/ProjectBuilder'
import { createProject } from '../../features/projects/server-functions'

export const Route = createFileRoute('/projects/new')({ component: NewProject })
function NewProject() { const navigate = useNavigate(); return <AppShell><ProjectBuilder saveLabel="Create project" onSave={async (configuration) => { const project = await createProject({ data: configuration }); await navigate({ to: '/projects/$projectId', params: { projectId: project.id } }) }} /></AppShell> }
