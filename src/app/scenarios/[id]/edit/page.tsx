"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react'
import YamlEditor from '@/components/YamlEditor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertCircle, Trash2 } from 'lucide-react'

export default function EditScenarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [scenarioId, setScenarioId] = useState<string>('')
  const [yamlContent, setYamlContent] = useState('')
  const [originalFilename, setOriginalFilename] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function initializeParams() {
      const resolvedParams = await params
      setScenarioId(resolvedParams.id)
    }
    initializeParams()
  }, [params])

  useEffect(() => {
    if (!scenarioId) return

    async function fetchScenario() {
      if (!session?.user) return

      try {
        const response = await fetch(`/api/scenarios/${scenarioId}`)
        if (response.ok) {
          const scenario = await response.json()
          setYamlContent(scenario.yamlContent || '')
          setOriginalFilename(scenario.filename || '')
        } else {
          setError('Failed to load scenario')
        }
      } catch {
        setError('An error occurred while loading the scenario')
      } finally {
        setIsLoading(false)
      }
    }

    fetchScenario()
  }, [scenarioId, session])

  if (status === 'loading' || isLoading) {
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
    if (!isValid) {
      setError('Please fix YAML validation errors before saving')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/scenarios/${scenarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          yamlContent
        }),
      })

      if (response.ok) {
        router.push(`/scenarios/${scenarioId}`)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to update scenario')
      }
    } catch {
      setError('An error occurred while updating the scenario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/scenarios/${scenarioId}`)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this scenario? This action cannot be undone.')) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`/api/scenarios/${scenarioId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push('/scenarios')
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to delete scenario')
      }
    } catch {
      setError('An error occurred while deleting the scenario')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error && !yamlContent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/scenarios')}>
            Back to Scenarios
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Scenario: {originalFilename}
          </h1>
          <p className="text-gray-600">
            Modify your workflow scenario using YAML format
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
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

          <div className="flex justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Scenario
            </Button>
            <div className="space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 