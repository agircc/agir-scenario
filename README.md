# AGIR Scenario Viewer

A Next.js application for viewing and exploring workflow scenarios stored in MongoDB from YAML files.

## Features

- 🔄 **YAML to MongoDB Sync**: Automatically sync YAML scenario files to MongoDB database
- 📊 **Interactive Scenario Viewer**: Browse scenarios with detailed workflow visualization including tools and APIs
- 🚀 **Next.js Interface**: Modern, responsive web interface built with Next.js and Tailwind CSS
- 🗄️ **MongoDB Storage**: Persistent storage with efficient querying and indexing
- ⚡ **Make Commands**: Simple Makefile commands for common tasks

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
make install
```

### 2. Add YAML Scenarios
Place your YAML scenario files in the `scenarios/` directory. Example structure:
```yaml
scenario:
  name: "Your Scenario Name"
  description: "Description of your workflow"
  roles:
    - name: "role_name"
      description: "Role description"
  states:
    - name: "State Name"
      roles: ["role_name"]
      description: "What happens in this state"
      tools: ["Tool1", "Tool2"]
      inputs: ["input1", "input2"]
      outputs: ["output1", "output2"]
      schemas: ["schema1", "schema2"]
```

### 3. Setup MongoDB
Ensure you have MongoDB running and create a `.env` file with your connection string:
```bash
MONGODB_URI=mongodb://localhost:27017/agir-scenarios
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agir-scenarios
```

### 4. Sync YAML to MongoDB
```bash
make sync-scenarios
```

This will sync all YAML files in the `scenarios/` directory to your MongoDB database.

### 5. Start the Development Server
```bash
npm run dev
# or
make dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Available Commands

| Command | Description |
|---------|-------------|
| `make sync-scenarios` | Sync YAML scenarios to MongoDB |
| `make install` | Install npm dependencies |
| `make dev` | Start development server |
| `make build` | Build the project |
| `make start` | Start production server |
| `make lint` | Run linter |
| `make clean` | Clean generated files |
| `make help` | Show available commands |

## Project Structure

```
agir-scenario/
├── scenarios/              # YAML scenario files
│   └── accounting.yml      # Example scenario
├── src/
│   ├── app/
│   │   ├── scenarios/      # Scenario viewer pages
│   │   │   ├── page.tsx    # Scenarios list page
│   │   │   └── [id]/
│   │   │       └── page.tsx # Individual scenario detail page
│   │   └── page.tsx        # Home page
│   ├── lib/
│   │   ├── mongodb.ts      # MongoDB connection utility
│   │   └── models/
│   │       └── Scenario.ts # Mongoose schema
│   └── types/
│       └── global.d.ts     # Global type declarations
├── scripts/
│   └── yaml-to-mongodb.js  # MongoDB sync script
├── Makefile               # Build commands
├── .env                   # Environment variables (MongoDB URI)
└── package.json
```

## Scenario File Format

Scenarios should be defined in YAML format with the following structure:

- **scenario**: Root object containing all scenario data
  - **name**: Display name for the scenario
  - **description**: Brief description of the workflow
  - **roles**: Array of roles involved in the scenario
    - **name**: Role identifier
    - **description**: Role description
  - **states**: Array of workflow states/steps
    - **name**: State name
    - **roles**: Array of role names involved in this state
    - **description**: What happens in this state
    - **tools**: Array of tools/systems used, each with:
      - **name**: Tool name
      - **apis**: Array of API endpoints or descriptions
    - **inputs**: Array of required inputs
    - **outputs**: Array of generated outputs
    - **schemas**: Array of data schemas involved

## Development

The application uses:
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB** - Document database for scenario storage
- **Mongoose** - MongoDB object modeling
- **Node.js** - YAML to MongoDB sync script

## Contributing

1. Add your YAML files to the `scenarios/` directory
2. Run `make sync-scenarios` to sync to MongoDB
3. Test the scenarios in the web interface
4. Submit your changes

## Requirements

- Node.js 18+ 
- MongoDB (local installation or Atlas cloud)
- npm or yarn package manager
