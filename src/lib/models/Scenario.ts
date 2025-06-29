import mongoose from 'mongoose'

interface Tool {
  name: string
  apis: string[]
}

interface Role {
  name: string
  description: string
}

interface State {
  name: string
  roles: string[]
  description: string
  tools: Tool[]
  inputs: string[]
  outputs: string[]
  schemas: string[]
}

interface Transition {
  from: string
  to: string
  condition?: string
}

interface IScenario {
  _id?: string
  name: string
  description: string
  roles: Role[]
  states: State[]
  transitions?: Transition[]
  filename: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

const ToolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    apis: [{ type: String }],
  },
  { _id: false }
)

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
)

const StateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roles: [{ type: String, required: true }],
    description: { type: String, required: true },
    tools: [ToolSchema],
    inputs: [{ type: String }],
    outputs: [{ type: String }],
    schemas: [{ type: String }],
  },
  { _id: false }
)

const TransitionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    condition: { type: String },
  },
  { _id: false }
)

const ScenarioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    roles: [RoleSchema],
    states: [StateSchema],
    transitions: [TransitionSchema],
    filename: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

// Create index for efficient querying
ScenarioSchema.index({ name: 1 })
ScenarioSchema.index({ userId: 1 })
ScenarioSchema.index({ userId: 1, filename: 1 }, { unique: true })

export type { IScenario, Tool, Role, State, Transition }
export default mongoose.models.Scenario ||
  mongoose.model<IScenario>('Scenario', ScenarioSchema)
