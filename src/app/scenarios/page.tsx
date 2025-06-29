import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Scenario from '@/lib/models/Scenario'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, ArrowRight } from 'lucide-react'

interface ScenarioSummary {
  id: string
  name: string
  description: string
  filename: string
  createdAt: Date
  updatedAt: Date
}

async function getScenarios(userId: string): Promise<ScenarioSummary[]> {
  try {
    await connectDB()

    const scenarios = await Scenario.find(
      { userId: userId },
      {
        name: 1,
        description: 1,
        filename: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    )
      .sort({ updatedAt: -1 })
      .lean()

    return scenarios.map((scenario) => ({
      id: scenario.filename,
      name: scenario.name || 'Unnamed Scenario',
      description: scenario.description || 'No description available',
      filename: scenario.filename,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
    }))
  } catch (error) {
    console.error('Error reading scenarios from MongoDB:', error)
    return []
  }
}

export default async function ScenariosPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/')
  }

  const scenarios = await getScenarios(session.user.id)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Scenarios
            </h1>
            <p className="text-gray-600">
              Browse and manage your workflow scenarios
            </p>
          </div>
          <Button asChild>
            <Link href="/scenarios/create">
              <Plus className="mr-2 h-4 w-4" />
              New Scenario
            </Link>
          </Button>
        </div>

        {scenarios.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Scenarios Found
            </h2>
            <p className="text-gray-500 mb-6">
              You haven&apos;t created any scenarios yet. Create your first
              scenario to get started.
            </p>
            <Button asChild>
              <Link href="/scenarios/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Scenario
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <Link
                key={scenario.id}
                href={`/scenarios/${scenario.id}`}
                className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {scenario.name}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {scenario.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Updated: {new Date(scenario.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                    View Workflow
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
