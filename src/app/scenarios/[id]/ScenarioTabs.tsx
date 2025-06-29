'use client'

import React from 'react'
import { type IScenario } from '@/lib/models/Scenario'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkflowDiagram from '@/components/WorkflowDiagram'

interface ScenarioTabsProps {
  scenario: IScenario
}

export default function ScenarioTabs({ scenario }: ScenarioTabsProps) {
  return (
    <Tabs defaultValue="diagram" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="diagram">Flow Diagram</TabsTrigger>
        <TabsTrigger value="detailed">Detailed View</TabsTrigger>
      </TabsList>

      <TabsContent value="detailed" className="mt-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Roles Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Roles
              </h2>
              <div className="space-y-4">
                {scenario.roles.map((role, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium text-gray-900 capitalize">
                      {role.name.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow States */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Workflow States
            </h2>
            <div className="space-y-6">
              {scenario.states.map((state, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {state.name}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {state.roles.map((role, roleIndex) => (
                          <span
                            key={roleIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{state.description}</p>

                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tools Section */}
                    {state.tools.length > 0 && (
                      <div className="col-span-full">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Tools & APIs</h4>
                        <div className="grid gap-3">
                          {state.tools.map((tool, toolIndex) => (
                            <div key={toolIndex} className="bg-green-50 border border-green-200 rounded-lg p-3">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium text-green-800">{tool.name}</span>
                              </div>
                              {tool.apis && tool.apis.length > 0 && (
                                <div className="ml-6">
                                  <p className="text-xs text-green-700 mb-1">APIs:</p>
                                  <ul className="text-xs text-green-600 space-y-1">
                                    {tool.apis.map((api, apiIndex) => (
                                      <li key={apiIndex} className="font-mono bg-green-100 px-2 py-1 rounded">
                                        {api}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inputs and Outputs */}
                    <div className="grid md:grid-cols-3 gap-4 col-span-full">
                      {state.inputs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Inputs</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {state.inputs.map((input, inputIndex) => (
                              <li key={inputIndex} className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                {input.replace(/_/g, ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {state.outputs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Outputs</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {state.outputs.map((output, outputIndex) => (
                              <li key={outputIndex} className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {output.replace(/_/g, ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {state.schemas.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Schemas</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {state.schemas.map((schema, schemaIndex) => (
                              <li key={schemaIndex} className="flex items-center">
                                <svg className="w-3 h-3 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                {schema.replace(/_/g, ' ')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="diagram" className="mt-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Workflow Flow Diagram
          </h2>
        </div>
        <WorkflowDiagram scenario={scenario} />
      </TabsContent>
    </Tabs>
  )
} 