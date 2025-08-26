'use server'

import { markSectionAsModified } from './version-actions'
import prettier from "prettier/standalone"
import parserHtml from "prettier/plugins/html"

// 💡 1. token 파라미터 추가
export async function saveDocumentContent(userId: number, sectionKey: string, content: string, token: string | null) {
  try {
    const finalHtml = `<!DOCTYPE html>\n${content}`

    // 💡 2. Authorization 헤더 동적 추가
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('http://localhost:8080/api/versions/editing', {
      method: 'POST',
      headers: headers, // 수정된 headers 객체 사용
      body: JSON.stringify({
        user_id: userId, 
        description: '편집중인 버전',
        createdAt: new Date().toISOString(),
        sectionsData: {
          [sectionKey]: finalHtml
        }
      })
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    return { success: true, message: "편집 버전이 저장되었습니다." }
  } catch (error) {
    console.error('Error saving document content to DB:', error)
    return { success: false, message: 'DB 저장 중 오류가 발생했습니다.' }
  }
}

// 💡 3. token 파라미터 추가
export async function updateDocumentSection(
  userId: number,
  htmlContent: string,
  sectionName: string,
  sectionType: 'section-1' | 'section-2',
  updatedContent: string,
  sectionId: string,
  sectionKey: string,
  token: string | null 
) {
  try {
    // ... (상단 로직은 동일)
    const updatedDoc = new DOMParser().parseFromString(updatedContent, 'text/html')
    const selector = `.${sectionType}[data-section="${sectionName}"]`
    const updatedSection = updatedDoc.querySelector(selector)

    if (!updatedSection) {
      return { success: false, message: '업데이트할 섹션을 찾을 수 없습니다.' }
    }
    const originalDoc = new DOMParser().parseFromString(htmlContent, 'text/html')
    const originalSection = originalDoc.querySelector(selector)
    if (!originalSection) {
      return { success: false, message: '원본에서 섹션을 찾을 수 없습니다.' }
    }
    originalSection.outerHTML = updatedSection.outerHTML
    const finalHtml = `<!DOCTYPE html>\n${originalDoc.documentElement.outerHTML}`
    const updatedHtml = await prettier.format(finalHtml, {
      parser: "html",
      plugins: [parserHtml],
    })

    // 💡 4. Authorization 헤더 동적 추가
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // DB 저장
    const response = await fetch('http://localhost:8080/api/versions/editing', {
      method: 'POST',
      headers: headers, // 수정된 headers 객체 사용
      body: JSON.stringify({
        user_id: userId,
        description: '편집중인 버전',
        createdAt: new Date().toISOString(),
        sectionsData: {
          [sectionKey]: updatedHtml
        }
      })
    })

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    if (sectionId) {
      await markSectionAsModified(sectionId)
    }

    return { success: true, message: "편집 버전이 저장되었습니다." }
  } catch (error) {
    console.error('Error updating document section:', error)
    return { success: false, message: '섹션 업데이트 중 오류가 발생했습니다.' }
  }
}