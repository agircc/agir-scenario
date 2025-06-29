# AGIR Scenario Viewer

A Next.js application for creating, viewing and exploring workflow scenarios with interactive flowchart visualization.

## Features

- 🎨 **Web-based Scenario Creation**: Create and edit scenarios directly in the web interface
- 📊 **Interactive Flowchart Viewer**: Visualize workflow states and transitions with dynamic flowcharts
- 🗄️ **MongoDB Storage**: Persistent storage with efficient querying and indexing

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory with your MongoDB connection string:

```bash
MONGODB_URI=mongodb://localhost:27017/agir-scenarios
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agir-scenarios

NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to:

- Create new scenarios using the web interface
- View existing scenarios with interactive flowcharts
- Edit and manage your workflow scenarios

## YAML Scenario Format

Scenarios are stored in YAML format with the following structure:

### Root Structure

```yaml
scenario:
  name: 'Scenario Name'
  description: 'Brief description of the workflow'
  roles: [...]
  states: [...]
  transitions: [...]
```

### Field Descriptions

#### **scenario** (object)

The root container for all scenario data.

#### **name** (string)

Display name for the scenario. This appears in the scenario list and as the title.

#### **description** (string)

Brief description explaining the purpose and scope of the workflow scenario.

#### **roles** (array of objects)

Defines the different actors or participants in the workflow.

```yaml
roles:
  - name: 'role_identifier'
    description: 'What this role does in the workflow'
```

- **name**: Unique identifier for the role (used in states)
- **description**: Human-readable explanation of the role's responsibilities

#### **states** (array of objects)

Defines the individual steps or phases in the workflow.

```yaml
states:
  - name: 'State Name'
    roles: ['role1', 'role2']
    description: 'What happens in this state'
    tools:
      - name: 'Tool Name'
        apis: ['API endpoint 1', 'API endpoint 2']
    inputs: ['input1', 'input2']
    outputs: ['output1', 'output2']
    schemas: ['schema1', 'schema2']
```

**State Fields:**

- **name**: Display name for this workflow state
- **roles**: Array of role names that participate in this state
- **description**: Detailed explanation of what occurs in this state
- **tools**: Array of tools/systems used in this state
  - **name**: Name of the tool or system
  - **apis**: Array of API endpoints or service descriptions
- **inputs**: Array of required inputs for this state
- **outputs**: Array of outputs produced by this state
- **schemas**: Array of data schemas or document types involved

#### **transitions** (array of objects)

Defines how the workflow moves between states.

```yaml
transitions:
  - from: 'Source State'
    to: 'Target State'
    condition: 'Optional condition for transition'
```

- **from**: Name of the source state
- **to**: Name of the destination state
- **condition**: Optional condition that must be met for the transition

### Example Usage

You can create scenarios either:

1. **Via Web Interface**: Use the create scenario page to build workflows visually
2. **Direct YAML**: Import YAML files that follow the above format

The web interface will automatically generate flowcharts showing the states, transitions, and role interactions based on your scenario definition.
