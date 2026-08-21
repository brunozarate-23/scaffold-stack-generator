import { seedCatalog } from '../features/stack-catalog/seed.server'

await seedCatalog()
console.log('Scaffold stack catalog seeded.')
