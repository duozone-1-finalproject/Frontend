'use client'

import React from 'react'
import { DocumentViewer } from '../components/dart-viewer/document-viewer'

export default function DartViewer() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DocumentViewer />
    </div>
  )
}
