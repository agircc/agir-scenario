'use client'

import { useRef } from 'react'
import Editor from '@monaco-editor/react'
import * as yaml from 'js-yaml'

interface YamlEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
  onValidationChange?: (isValid: boolean, errors: string[]) => void
}

export default function YamlEditor({
  value,
  onChange,
  height = '400px',
  readOnly = false,
  onValidationChange,
}: YamlEditorProps) {
  const editorRef = useRef<unknown>(null)

  function handleEditorDidMount(editor: unknown, monaco: unknown) {
    editorRef.current = editor

    // Configure YAML language support
    const monacoEditor = monaco as {
      languages: {
        setLanguageConfiguration: (language: string, config: unknown) => void
        registerDocumentFormattingEditProvider: (
          language: string,
          provider: unknown
        ) => void
      }
    }

    monacoEditor.languages.setLanguageConfiguration('yaml', {
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
      ],
    })

    // Add YAML validation
    monacoEditor.languages.registerDocumentFormattingEditProvider('yaml', {
      provideDocumentFormattingEdits: function (model: {
        getValue: () => string
        getFullModelRange: () => unknown
      }) {
        try {
          const parsed = yaml.load(model.getValue())
          const formatted = yaml.dump(parsed, {
            indent: 2,
            lineWidth: 120,
            quotingType: '"',
          })
          return [
            {
              range: model.getFullModelRange(),
              text: formatted,
            },
          ]
        } catch {
          return []
        }
      },
    })
  }

  function handleEditorChange(value: string | undefined) {
    const newValue = value || ''
    onChange(newValue)

    // Validate YAML
    if (onValidationChange) {
      try {
        yaml.load(newValue)
        onValidationChange(true, [])
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown YAML error'
        onValidationChange(false, [errorMessage])
      }
    }
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="yaml"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          readOnly: readOnly,
          theme: 'vs',
          fontSize: 14,
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  )
}
