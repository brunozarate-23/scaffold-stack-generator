import { Link } from '@tanstack/react-router'
import { Blocks } from 'lucide-react'
import type { ReactNode } from 'react'

export function AppShell({ children }: { children: ReactNode }) { return <div className="app-shell"><header className="site-header"><Link to="/dashboard" className="brand"><Blocks size={19} />Scaffold</Link><nav><Link to="/dashboard">Projects</Link><Link to="/projects/new" className="button primary small">Create project</Link></nav></header><main>{children}</main></div> }
