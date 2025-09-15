'use client'

import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { DocumentViewer } from '../components/dart-viewer/document-viewer'

export default function DartViewer() {
  const [searchParams] = useSearchParams()
  const corpCode = searchParams.get('corpCode')
  const companyName = searchParams.get('companyName')

  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentViewer corpCode={corpCode} companyName={companyName} />
    </div>
  )
}
