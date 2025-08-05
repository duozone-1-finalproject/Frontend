import { formatDocumentForExport } from "./documentFormatter"

// 동적 import를 사용하여 클라이언트에서만 라이브러리 로드
async function loadPDFLibraries() {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")])
  return { jsPDF, html2canvas }
}

export async function downloadAsPDF(element: HTMLDivElement, filename = "증권신고서.pdf") {
  try {
    const { jsPDF, html2canvas } = await loadPDFLibraries()

    // 요소가 화면에 보이는지 확인
    if (!element.offsetParent) {
      throw new Error("문서 요소를 찾을 수 없습니다.")
    }

    // 더 나은 품질을 위한 옵션 설정
    const canvas = await html2canvas(element, {
      useCORS: true,
      allowTaint: true,
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/png", 1.0)

    // A4 크기로 PDF 생성
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 이미지가 페이지보다 길면 여러 페이지로 분할
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
    }

    pdf.save(filename)
  } catch (error) {
    console.error("PDF 생성 오류:", error)
    throw new Error("PDF 생성 중 오류가 발생했습니다.")
  }
}

export function generateFilename(extension: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")

  return `증권신고서_${year}${month}${day}_${hours}${minutes}${seconds}.${extension}`
}

export function downloadAsText(content: string, filename = "증권신고서.txt") {
  try {
    const textContent = formatDocumentForExport(content)
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = filename
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("텍스트 파일 저장 오류:", error)
    throw new Error("텍스트 파일 저장 중 오류가 발생했습니다.")
  }
}
