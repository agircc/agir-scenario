import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Scenario, { type IScenario } from '@/lib/models/Scenario'
import ScenarioTabs from './ScenarioTabs'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'

async function getScenario(id: string, userId: string): Promise<IScenario | null> {
  try {
    await connectDB()
    const scenario = await Scenario.findOne({
      filename: id,
      userId: userId
    }).lean()
    return scenario as IScenario | null
  } catch (error) {
    console.error(`Error reading scenario ${id} from MongoDB:`, error)
    return null
  }
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const scenarios = await Scenario.find({}, { filename: 1 }).lean()

    return scenarios.map((scenario) => ({
      id: scenario.filename
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Serialize scenario to remove MongoDB-specific fields
function serializeScenario(scenario: IScenario): IScenario {
  return {
    name: scenario.name,
    description: scenario.description,
    roles: scenario.roles,
    states: scenario.states,
    transitions: scenario.transitions || [],
    filename: scenario.filename,
    userId: scenario.userId
  }
}

export default async function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const { id } = await params
  const scenario = await getScenario(id, session.user.id)

  if (!scenario) {
    notFound()
  }

  // Serialize the scenario to remove MongoDB-specific fields
  const serializedScenario = serializeScenario(scenario)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" asChild>
              <Link href="/scenarios">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scenarios
              </Link>
            </Button>

            <Button asChild>
              <Link href={`/scenarios/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Scenario
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {serializedScenario.name}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {serializedScenario.description}
          </p>
        </div>

        <ScenarioTabs scenario={serializedScenario} />
      </div>
    </div>
  )
} 