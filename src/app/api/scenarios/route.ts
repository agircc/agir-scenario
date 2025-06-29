import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Scenario from '@/lib/models/Scenario'
import * as yaml from 'js-yaml'

// GET /api/scenarios - Get user's scenarios
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const scenarios = await Scenario.find(
      { userId: session.user.id },
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

    return NextResponse.json(scenarios)
  } catch (error) {
    console.error('Error fetching scenarios:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/scenarios - Create new scenario
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { yamlContent, filename } = await request.json()

    if (!yamlContent || !filename) {
      return NextResponse.json(
        { message: 'YAML content and filename are required' },
        { status: 400 }
      )
    }

    // Parse and validate YAML
    let scenarioData
    try {
      const parsed = yaml.load(yamlContent)
      if (!parsed || typeof parsed !== 'object' || !('scenario' in parsed)) {
        throw new Error('YAML must contain a scenario object')
      }
      scenarioData = (parsed as Record<string, unknown>).scenario
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown YAML error'
      return NextResponse.json(
        { message: `Invalid YAML: ${errorMessage}` },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if filename already exists for this user
    const existingScenario = await Scenario.findOne({
      userId: session.user.id,
      filename: filename,
    })

    if (existingScenario) {
      return NextResponse.json(
        { message: 'A scenario with this filename already exists' },
        { status: 400 }
      )
    }

    // Create new scenario
    const scenario = new Scenario({
      name:
        (scenarioData as Record<string, unknown>).name || 'Unnamed Scenario',
      description:
        (scenarioData as Record<string, unknown>).description ||
        'No description',
      roles: (scenarioData as Record<string, unknown>).roles || [],
      states: (scenarioData as Record<string, unknown>).states || [],
      transitions: (scenarioData as Record<string, unknown>).transitions || [],
      filename: filename,
      userId: session.user.id,
    })

    await scenario.save()

    return NextResponse.json(
      {
        message: 'Scenario created successfully',
        scenarioId: scenario._id,
        filename: scenario.filename,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating scenario:', error)
    // Handle MongoDB duplicate key error
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          message:
            'A scenario with this filename already exists. Please choose a different name.',
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
