"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ArrowLeft, Check, Eye, Search, Sparkles, FileText, TrendingUp, Zap, Activity } from "lucide-react"
import { documentTemplates, type DocumentTemplate } from "../../utils/documentTemplates"

interface TemplateSelectorProps {
  onSelectTemplate: (template: DocumentTemplate) => void
  onBack: () => void
}

export default function TemplateSelector({ onSelectTemplate, onBack }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const categories = Array.from(new Set(documentTemplates.map((t) => t.category)))

  const filteredTemplates = documentTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
  }

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
    }
  }

  const handlePreview = (template: DocumentTemplate) => {
    setPreviewTemplate(template)
  }

  const closePreview = () => {
    setPreviewTemplate(null)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "일반":
        return <FileText className="w-5 h-5" />
      case "IPO":
        return <TrendingUp className="w-5 h-5" />
      case "기술":
        return <Zap className="w-5 h-5" />
      case "바이오":
        return <Activity className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "일반":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "IPO":
        return "bg-red-100 text-red-800 border-red-200"
      case "기술":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "바이오":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex-1 flex flex-col">
        {/* 헤더 */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="flex items-center space-x-2 hover:bg-gray-100/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>돌아가기</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <span>증권신고서 템플릿 선택</span>
                </h1>
                <p className="text-gray-600 mt-1">비즈니스에 맞는 전문 템플릿을 선택해주세요</p>
              </div>
            </div>
            {selectedTemplate && (
              <Button
                onClick={handleConfirmSelection}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Check className="w-4 h-4" />
                <span>선택 완료</span>
              </Button>
            )}
          </div>

          {/* 검색 바 */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="템플릿 검색..."
                className="pl-10 bg-white/70 border-gray-200/50 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200/30">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">카테고리:</span>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                    category,
                  )}`}
                >
                  {getCategoryIcon(category)}
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 템플릿 그리드 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`group bg-white/80 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:bg-white ${
                  selectedTemplate?.id === template.id
                    ? "border-blue-500 shadow-xl ring-4 ring-blue-200/50 bg-white"
                    : "border-gray-200/50 hover:border-gray-300/70"
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                {/* 카드 헤더 */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${getCategoryColor(template.category).replace(
                          "text-",
                          "bg-",
                        )} bg-opacity-20`}
                      >
                        {getCategoryIcon(template.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                            template.category,
                          )}`}
                        >
                          {template.category}
                        </span>
                      </div>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <div className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{template.description}</p>
                </div>

                {/* 기능 태그 */}
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">포함 기능:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100/80 text-gray-700 text-xs px-2.5 py-1 rounded-full border border-gray-200/50"
                      >
                        {feature}
                      </span>
                    ))}
                    {template.features.length > 3 && (
                      <span className="inline-block bg-blue-100/80 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-200/50">
                        +{template.features.length - 3}개 더
                      </span>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="px-6 pb-6 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePreview(template)
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 bg-white/70 hover:bg-white border-gray-200/50 hover:border-gray-300 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>미리보기</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTemplateSelect(template)
                    }}
                    variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                    className={`flex-1 transition-all duration-200 ${
                      selectedTemplate?.id === template.id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                        : "bg-white/70 hover:bg-blue-50 border-gray-200/50 hover:border-blue-300"
                    }`}
                  >
                    {selectedTemplate?.id === template.id ? "선택됨" : "선택"}
                  </Button>
                </div>

                {/* 호버 효과 */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* 검색 결과 없음 */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-gray-200/50">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 키워드로 검색해보세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 미리보기 모달 */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getCategoryColor(previewTemplate.category).replace("text-", "bg-")} bg-opacity-20`}
                >
                  {getCategoryIcon(previewTemplate.category)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{previewTemplate.name}</h3>
                  <p className="text-gray-600">미리보기</p>
                </div>
              </div>
              <Button variant="ghost" onClick={closePreview} className="hover:bg-white/80">
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-gray-50">
              <div
                className="prose max-w-none bg-white p-6 rounded-lg shadow-sm"
                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent() }}
              />
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={closePreview} className="bg-white">
                닫기
              </Button>
              <Button
                onClick={() => {
                  setSelectedTemplate(previewTemplate)
                  closePreview()
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                이 템플릿 선택
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
