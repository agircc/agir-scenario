import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Scenario, { IScenario } from '@/lib/models/Scenario'
import * as yaml from 'js-yaml'

// GET /api/scenarios/[filename] - Get specific scenario
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { filename } = await params
    await connectDB()

    const scenario = (await Scenario.findOne({
      filename: filename,
      userId: session.user.id,
    }).lean()) as IScenario | null

    if (!scenario) {
      return NextResponse.json(
        { message: 'Scenario not found' },
        { status: 404 }
      )
    }

    // Convert to YAML format for editing
    const yamlData = {
      scenario: {
        name: scenario.name,
        description: scenario.description,
        roles: scenario.roles,
        states: scenario.states,
        transitions: scenario.transitions || [],
      },
    }

    const yamlContent = yaml.dump(yamlData, {
      indent: 2,
      lineWidth: 120,
      quotingType: '"',
    })

    return NextResponse.json({
      ...scenario,
      yamlContent,
    })
  } catch (error) {
    console.error('Error fetching scenario:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/scenarios/[filename] - Update scenario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { filename } = await params
    const { yamlContent } = await request.json()

    if (!yamlContent) {
      return NextResponse.json(
        { message: 'YAML content is required' },
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

    // Find and update scenario
    const scenario = await Scenario.findOneAndUpdate(
      {
        filename: filename,
        userId: session.user.id,
      },
      {
        name:
          (scenarioData as Record<string, unknown>).name || 'Unnamed Scenario',
        description:
          (scenarioData as Record<string, unknown>).description ||
          'No description',
        roles: (scenarioData as Record<string, unknown>).roles || [],
        states: (scenarioData as Record<string, unknown>).states || [],
        transitions:
          (scenarioData as Record<string, unknown>).transitions || [],
      },
      { new: true, runValidators: true }
    )

    if (!scenario) {
      return NextResponse.json(
        { message: 'Scenario not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Scenario updated successfully',
      scenario,
    })
  } catch (error) {
    console.error('Error updating scenario:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/scenarios/[filename] - Delete scenario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { filename } = await params
    await connectDB()

    const scenario = await Scenario.findOneAndDelete({
      filename: filename,
      userId: session.user.id,
    })

    if (!scenario) {
      return NextResponse.json(
        { message: 'Scenario not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Scenario deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting scenario:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
