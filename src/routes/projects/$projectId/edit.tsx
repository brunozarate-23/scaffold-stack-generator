import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { AppShell } from '../../../components/AppShell'
import { ProjectBuilder } from '../../../components/ProjectBuilder'
import { getProject, updateProject } from '../../../features/projects/server-functions'

export const Route = createFileRoute('/projects/$projectId/edit')({ loader: async ({ params }) => { const project = await getProject({ data: { projectId: params.projectId } }); if (!project) throw notFound(); return project }, component: EditProject })
function EditProject() { const project = Route.useLoaderData(); const navigate = useNavigate(); return <AppShell><ProjectBuilder initial={project} saveLabel="Save changes" onSave={async (configuration) => { await updateProject({ data: { id: project.id, configuration } }); await navigate({ to: '/projects/$projectId', params: { projectId: project.id } }) }} /></AppShell> }
