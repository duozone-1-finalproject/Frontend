'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { Edit3, X, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react'
import { saveDocumentContent, updateDocumentSection } from '../../lib/dart-viewer/document-actions'
import { getSectionKeyFromId } from '../../data/dart-viewer/mockDocumentData'
import React from 'react'
import axios from '../../api/axios'

interface DocumentContentProps {
  userId: number,
  htmlContent: string
  sectionId: string
  sectionName?: string
  sectionType?: 'part' | 'section-1' | 'section-2'
  onSectionModified?: (sectionId: string, updatedHTML: string) => void
  modifiedSections?: Set<string>
}

function fillTemplate(template:string, data: Record<string, any>): string {
  let result = template;
  for (const key in data) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    const value = data[key] ?? '';
    result = result.replace(placeholder, value);
  }
  return result;
}

// 날짜 포맷팅 함수 (YYYY-MM-DD -> YYYY년 MM월 DD일)
function formatDate(dateStr: string | null): string {
  if (!dateStr || dateStr === null) return "-";
  
  if (dateStr.includes("년")) return dateStr;
  
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${year}년 ${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
  }
  
  return dateStr;
}

export function DocumentContent({ 
  userId,
  htmlContent, 
  sectionId, 
  sectionName, 
  sectionType,
  onSectionModified,
  modifiedSections 
}: DocumentContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [originalHtml, setOriginalHtml] = useState('')
  const [currentHtml, setCurrentHtml] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [templateData, setTemplateData] = useState<Record<string, any> | null>(null);
  const [aiAnnotationState, setAiAnnotationState] = useState<'loading' | 'success' | 'error'>('loading');

  const formatNumber = (value: any) => {
    if (!value) return "";
    const num = Number(value);
    if (isNaN(num)) return value;
    return num.toLocaleString("ko-KR");
  };

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await axios.get('/api/dart/test/01571107/all-data');
        if (response.data && response.data.status === "SUCCESS") {
          const apiData = response.data.data;
          
          const mappedData = {
            company_name: apiData.companyOverview?.corpName,
            ceo_name: apiData.companyOverview?.ceoNm,
            address: apiData.companyOverview?.adres,
            establishment_date: apiData.companyOverview?.estDt,
            company_phone: apiData.companyOverview?.phnNo,
            company_website: apiData.companyOverview?.hmUrl,
            S4_11A_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stksen || "",
            S4_11A_2: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.stkcnt),
            S4_11A_3: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.fv),
            S4_11A_4: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slprc),
            S4_11A_5: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slta),
            S4_11A_6: apiData.equitySecurities?.group?.find((g:any)=>g.title==="증권의종류")?.list?.[0]?.slmthn || "",
            S4_11B_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.actsen || "",
            S4_11B_2: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.actnmn || "",
            S4_11B_3: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.stksen || "",
            S4_11B_4: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtcnt),
            S4_11B_5: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtamt),
            S4_11B_6: formatNumber(apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtprc),
            S4_11B_7: apiData.equitySecurities?.group?.find((g:any)=>g.title==="인수인정보")?.list?.[0]?.udtmth || "",
            S4_11C_1: apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.sbd || "",
            S4_11C_2: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.pymd) || "",
            S4_11C_3: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.sband) || "",
            S4_11C_4: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.asand) || "",
            S4_11C_5: formatDate(apiData.equitySecurities?.group?.find((g:any)=>g.title==="일반사항")?.list?.[0]?.asstd) || "-",
            S4_NOTE1_1: "AI 주석을 생성하고 있습니다...",
            S4_NOTE1_2: "AI 주석을 생성하고 있습니다...",
            S4_NOTE1_3: "AI 주석을 생성하고 있습니다...",
            S4_NOTE1_4: "AI 주석을 생성하고 있습니다...",
            S4_NOTE1_5: "AI 주석을 생성하고 있습니다..."
          };

          console.log("✅ [all-data] mappedData:", mappedData);
          setAiAnnotationState('loading');
          setTemplateData(mappedData);
          
          await requestEquityAnnotations(mappedData);
          
        } else {
          throw new Error("템플릿 데이터 로드 실패");
        }
      } catch (error) {
        console.error("템플릿 데이터 로딩 중 오류 발생:", error);
        setHasError(true);
      }
    };
    fetchTemplateData();
  }, [sectionId]);

  const requestEquityAnnotations = async (templateData: any) => {
    try {
      const equityRequestData = {
        company_name: templateData.company_name || "",
        ceo_name: templateData.ceo_name || null,
        address: templateData.address || null,
        establishment_date: templateData.establishment_date || null,
        company_phone: templateData.company_phone || null,
        company_website: templateData.company_website || null,
        S4_11A_1: templateData.S4_11A_1 || "",
        S4_11A_2: templateData.S4_11A_2 || "",
        S4_11A_3: templateData.S4_11A_3 || "",
        S4_11A_4: templateData.S4_11A_4 || "",
        S4_11A_5: templateData.S4_11A_5 || "",
        S4_11A_6: templateData.S4_11A_6 || "",
        S4_11B_1: templateData.S4_11B_1 || "",
        S4_11B_2: templateData.S4_11B_2 || "",
        S4_11B_3: templateData.S4_11B_3 || "",
        S4_11B_4: templateData.S4_11B_4 || "",
        S4_11B_5: templateData.S4_11B_5 || "",
        S4_11B_6: templateData.S4_11B_6 || "",
        S4_11B_7: templateData.S4_11B_7 || "",
        S4_11C_1: templateData.S4_11C_1 || "",
        S4_11C_2: templateData.S4_11C_2 || "",
        S4_11C_3: templateData.S4_11C_3 || "",
        S4_11C_4: templateData.S4_11C_4 || "",
        S4_11C_5: templateData.S4_11C_5 || ""
      };

      console.log("🤖 [AI Request] Equity Annotation Data:", equityRequestData);

      const response = await axios.post('/api/ai/equity-annotation', equityRequestData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.status === 200) {
        const aiResponse = response.data.data;
        
        const generatedNotes = {
          S4_NOTE1_1: aiResponse.S4_NOTE1_1 || getDefaultNote(1),
          S4_NOTE1_2: aiResponse.S4_NOTE1_2 || getDefaultNote(2),
          S4_NOTE1_3: aiResponse.S4_NOTE1_3 || getDefaultNote(3),
          S4_NOTE1_4: aiResponse.S4_NOTE1_4 || getDefaultNote(4),
          S4_NOTE1_5: aiResponse.S4_NOTE1_5 || getDefaultNote(5)
        };

        setTemplateData(prev => ({ ...prev, ...generatedNotes }));
        setAiAnnotationState('success');
        console.log("✅ [AI Result] 주식 공모 주석 생성 완료:", generatedNotes);
        
      } else {
        throw new Error("AI 주석 생성 응답 오류");
      }
    } catch (error: any) {
      console.error("❌ [AI Request] 주식 공모 주석 생성 오류:", error);
      
      setTemplateData(prev => ({
        ...prev,
        S4_NOTE1_1: `(오류) AI 주석 생성에 실패했습니다: ${error.message}`,
        S4_NOTE1_2: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_3: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_4: "(오류) AI 주석 생성에 실패했습니다.",
        S4_NOTE1_5: "(오류) AI 주석 생성에 실패했습니다."
      }));
      setAiAnnotationState('error');
    }
  };

  const handleInsertDefaultNotes = () => {
    setTemplateData(prev => ({
      ...prev,
      S4_NOTE1_1: getDefaultNote(1),
      S4_NOTE1_2: getDefaultNote(2), 
      S4_NOTE1_3: getDefaultNote(3),
      S4_NOTE1_4: getDefaultNote(4),
      S4_NOTE1_5: getDefaultNote(5)
    }));
    setAiAnnotationState('success');
  };

  const getDefaultNote = (index: number): string => {
    const defaultNotes: { [key: number]: string } = {
      1: "모집(매출) 예정가액과 관련된 내용은「제1부 모집 또는 매출에 관한 사항」- 「Ⅳ. 인수인의 의견(분석기관의 의견)」의 「4. 공모가격에 대한 의견」부분을 참조하시기 바랍니다.",
      2: "모집(매출)가액, 모집(매출)총액, 인수금액 및 인수대가는 발행회사와 대표주관회사가 협의하여 제시하는 공모희망가액 기준입니다.",
      3: "모집(매출)가액의 확정은 청약일 전에 실시하는 수요예측 결과를 반영하여 대표주관회사와 발행회사가 협의하여 최종 결정할 예정입니다.",
      4: "증권의 발행 및 공시 등에 관한 규정에 따라 정정신고서 상의 공모주식수는 증권신고서의 공모할 주식수의 80% 이상 120% 이하로 변경가능합니다.",
      5: "투자 위험 등 자세한 내용은 투자설명서를 참조하시기 바라며, 투자결정시 신중하게 검토하시기 바랍니다."
    };
    return defaultNotes[index] || "주석 내용을 불러오는 중입니다...";
  };

  useEffect(() => {
    setIsEditing(false)
    setSaveMessage('')
  }, [sectionId, sectionName])

  useEffect(() => {
    const loadContent = () => {
      if (!htmlContent || !templateData) {
        if (!htmlContent) setHasError(true);
        return;
      }
      setIsLoading(true);
      setHasError(false);
      try {
        let processedHtml = htmlContent;

        if (sectionName && sectionType && sectionType !== 'part') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            let extractedContent = '';
            if (sectionType === 'section-1') {
              const section1Elements = doc.querySelectorAll('.section-1');
              for (const element of Array.from(section1Elements)) {
                if (element.getAttribute('data-section') === sectionName) {
                  extractedContent = element.outerHTML;
                  break;
                }
              }
            } else if (sectionType === 'section-2') {
              const section2Elements = doc.querySelectorAll('.section-2');
              for (const element of Array.from(section2Elements)) {
                if (element.getAttribute('data-section') === sectionName) {
                  extractedContent = element.outerHTML;
                  break;
                }
              }
            }
            if (extractedContent) {
              const head = doc.querySelector('head')?.outerHTML || '';
              processedHtml = `
                <!DOCTYPE html>
                <html lang="ko">
                ${head}
                <body>
                  <div class="document-content">
                    ${extractedContent}
                  </div>
                </body>
                </html>
              `;
            }
        }
        
        processedHtml = fillTemplate(processedHtml, templateData);

        if (iframeRef.current) {
          const iframeDoc = iframeRef.current.contentDocument;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(processedHtml);
            iframeDoc.close();
            setOriginalHtml(processedHtml);
            setCurrentHtml(processedHtml);
            setTimeout(() => {
              ensureReadOnlyMode(iframeDoc);
              setIsLoading(false);
            }, 100);
          }
        }
      } catch (error) {
        console.error('HTML 컨텐츠 로드 오류:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };
    loadContent();
  }, [htmlContent, sectionId, sectionName, sectionType, templateData]);

  const ensureReadOnlyMode = (iframeDoc: Document) => {
    const body = iframeDoc.body
    if (body) {
      body.contentEditable = 'false'
      body.style.outline = 'none'
      body.style.outlineOffset = '0'
      const existingStyles = iframeDoc.querySelectorAll('style')
      existingStyles.forEach(style => {
        if (style.textContent?.includes('contenteditable')) {
          style.remove()
        }
      })
    }
  }

  const handleEdit = () => {
    if (!iframeRef.current) return
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (!iframeDoc) return
    setOriginalHtml(iframeDoc.documentElement.outerHTML)
    const body = iframeDoc.body
    if (body) {
      body.contentEditable = 'true'
      body.style.outline = '2px dashed #3b82f6'
      body.style.outlineOffset = '4px'
      body.focus()
    }
    setIsEditing(true)
    setSaveMessage('')
  }

  const handleSave = async () => {
    if (!iframeRef.current) return
    
    setIsSaving(true)
    setSaveMessage('')
    
    let editedHtml = "";
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (!iframeDoc) return

      const body = iframeDoc.body
      if (body) {
        body.contentEditable = 'false'
        body.removeAttribute('contenteditable')
        body.style.outline = 'none'
        body.style.outlineOffset = '0'
      }
      
      editedHtml = iframeDoc.documentElement.outerHTML

      const token = localStorage.getItem("accessToken");
      let result;

      const sectionKey = getSectionKeyFromId(sectionId)

      if (sectionName && sectionType && sectionType !== 'part') {
        result = await updateDocumentSection(userId, htmlContent, sectionName, sectionType, editedHtml, sectionId, sectionKey, token);
      } else {
        result = await saveDocumentContent(userId, sectionKey, editedHtml, token);
      }
      
      setCurrentHtml(editedHtml)
      setOriginalHtml(editedHtml)
      setIsEditing(false)
      
      setSaveMessage('편집이 완료되었습니다. "최종 저장"을 눌러 DB에 저장하세요.')
      
      setTimeout(() => {
        setSaveMessage('')
      }, 5000)
      
    } catch (error: any) {
      console.error('편집 완료 오류:', error)
      setSaveMessage('편집 완료 중 오류가 발생했습니다.')
      
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document
      const body = iframeDoc?.body
      if (body) {
        body.contentEditable = 'true'
        body.style.outline = '2px dashed #3b82f6'
        body.style.outlineOffset = '4px'
      }
    } finally {
      if (onSectionModified) {
        if (editedHtml !== null) {
          onSectionModified(sectionId, editedHtml);
        }
      }
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (!iframeRef.current) return
    
    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
    if (iframeDoc && originalHtml) {
      iframeDoc.open()
      iframeDoc.write(originalHtml)
      iframeDoc.close()
      
      setTimeout(() => {
        ensureReadOnlyMode(iframeDoc)
      }, 100)
    }
    
    setIsEditing(false)
    setSaveMessage('')
  }

  const handleImageInsert = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const imgSrc = reader.result as string
        const iframeDoc = iframeRef.current?.contentDocument
        if (!iframeDoc) return

        const selection = iframeDoc.getSelection()
        if (!selection || !selection.rangeCount) return

        const img = iframeDoc.createElement('img')
        img.src = imgSrc
        img.style.maxWidth = '100%'
        img.style.height = 'auto'

        const range = selection.getRangeAt(0)
        range.insertNode(img)
      }
      reader.readAsDataURL(file)
    }

    input.click()
  }

  if (!htmlContent) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 text-sm">선택된 섹션의 내용이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {aiAnnotationState === 'error' && !isEditing && (
          <Button
            onClick={handleInsertDefaultNotes}
            size="sm"
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            기본 주석 삽입
          </Button>
        )}
        
        {/* 💡 컴파일 오류를 유발한 삼항 연산자를 두 개의 독립된 조건부 렌더링 블록으로 수정 */}
        {!isEditing && (
            <Button
                onClick={handleEdit}
                size="sm"
                variant="outline"
                className="bg-white shadow-md hover:bg-gray-50"
            >
                <Edit3 className="w-4 h-4 mr-1" />
                편집 시작
            </Button>
        )}

        {isEditing && (
            <div className="flex items-center gap-2">
                <Button
                    onClick={handleImageInsert}
                    size="sm"
                    variant="outline"
                    className="bg-white shadow-md hover:bg-gray-50"
                >
                    이미지 추가
                </Button>
                <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {isSaving ? '편집 완료 중...' : '편집 완료'}
                </Button>

                <Button
                    onClick={handleCancel}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                >
                    <X className="w-4 h-4 mr-1" />
                    취소
                </Button>
            </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute top-16 right-4 z-20 bg-blue-100 text-blue-800 p-3 rounded-md shadow-md max-w-sm">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">편집 중</span>
          </div>
          <p className="text-xs mt-1">
            문서 내용을 직접 클릭하여 수정할 수 있습니다.
          </p>
        </div>
      )}
      {saveMessage && (
        <div className={`absolute ${isEditing ? 'top-32' : 'top-16'} right-4 z-20 p-3 rounded-md shadow-md max-w-sm transition-opacity duration-300 ${
          saveMessage.includes('완료') || saveMessage.includes('성공')
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {saveMessage.includes('완료') || saveMessage.includes('성공') ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{saveMessage}</span>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">문서를 불러오는 중...</p>
          </div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-red-600 text-sm mb-2">문서를 불러올 수 없습니다.</p>
            <button 
              onClick={() => {
                setHasError(false)
                setIsLoading(true)
                // This might need to re-trigger fetch
              }}
              className="text-blue-600 text-sm hover:underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        key={`${sectionId}-${sectionName || 'full'}-${htmlContent.length}`}
        className="w-full h-full border-0"
        title="Document Content"
        sandbox="allow-same-origin allow-scripts"
        style={{ display: isLoading || hasError ? 'none' : 'block' }}
      />
    </div>
  )
}

