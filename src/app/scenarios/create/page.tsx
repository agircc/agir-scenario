"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import YamlEditor from '@/components/YamlEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

const defaultScenarioYaml = `scenario:
  name: "New Scenario"
  description: "Description of the scenario"
  roles:
    - name: "User"
      description: "End user role"
    - name: "System"
      description: "System role"
  states:
    - name: "start"
      roles: ["User"]
      description: "Initial state"
      tools: []
      inputs: []
      outputs: []
      schemas: []
    - name: "end"
      roles: ["System"]
      description: "Final state"
      tools: []
      inputs: []
      outputs: []
      schemas: []
  transitions:
    - from: "start"
      to: "end"
      condition: "completion"`

export default function CreateScenarioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [yamlContent, setYamlContent] = useState(defaultScenarioYaml)
  const [filename, setFilename] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!session?.user) {
    redirect('/')
  }

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Please enter a filename')
      return
    }

    if (!isValid) {
      setError('Please fix YAML validation errors before saving')
      return
    }

    setIsSubmitting(true)
    setError('')

    // Process filename: trim and replace spaces with hyphens
    const processedFilename = filename.trim().replace(/\s+/g, '-')

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yamlContent,
          filename: processedFilename
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/scenarios/${result.filename}`)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create scenario')
      }
    } catch {
      setError('An error occurred while creating the scenario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/scenarios')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Scenario
          </h1>
          <p className="text-gray-600">
            Define your workflow scenario using YAML format
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter scenario filename (without extension)"
              disabled={isSubmitting}
              className="mt-2"
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be used as the unique identifier for your scenario. Spaces will be automatically replaced with hyphens (-).
            </p>
          </div>

          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-2">
              YAML Content
            </Label>
            <div className="mt-2">
              <YamlEditor
                value={yamlContent}
                onChange={setYamlContent}
                height="500px"
                onValidationChange={(valid, errors) => {
                  setIsValid(valid)
                  setValidationErrors(errors)
                }}
              />
            </div>
            {!isValid && validationErrors.length > 0 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                  <p className="text-sm font-medium text-red-800">Validation Errors:</p>
                </div>
                <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !isValid || !filename.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Scenario'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 