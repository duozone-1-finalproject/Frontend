import { getInitialDocumentHTML } from "./documentUtils"

export const handleSavePDF = async (documentContent: string) => {
  try {
    const content = documentContent || getInitialDocumentHTML()

    // HTML을 깔끔하게 정리
    const cleanContent = content
      .replace(/<div class="document-header">/g, '<div style="text-align: center; margin-bottom: 2rem;">')
      .replace(
        /<h1 class="document-title">/g,
        '<h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">',
      )
      .replace(
        /<h2 class="section-title">/g,
        '<h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #2563eb; border-left: 4px solid #2563eb; padding-left: 0.75rem;">',
      )
      .replace(/<h3 class="subsection-title">/g, '<h3 style="font-weight: 500; margin-bottom: 1rem;">')
      .replace(/<div class="info-row">/g, '<div style="display: flex; align-items: center; margin-bottom: 1rem;">')
      .replace(/<div class="info-label">/g, '<div style="width: 8rem; font-size: 0.875rem; font-weight: 500;">')
      .replace(/<div class="info-value">/g, '<div style="flex: 1; color: #6b7280; font-style: italic;">')
      .replace(/<ul class="content-list">/g, '<ul style="list-style-type: disc; margin-left: 1rem;">')
      .replace(
        /<hr class="document-divider">/g,
        '<hr style="border: none; border-top: 2px solid #d1d5db; margin: 2rem 0;">',
      )

    // 완전한 HTML 문서 생성
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>증권신고서</title>
    <style>
        body {
            font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        table td, table th {
            border: 1px solid #ced4da;
            padding: 8px 12px;
            text-align: left;
        }
        table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>
    ${cleanContent}
    <script>
        window.onload = async function() {
            try {
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const canvas = await html2canvas(document.body, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true
                });
                
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 190;
                const pageHeight = 297;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 10;
                
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - 20);
                
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight + 10;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= (pageHeight - 20);
                }
                
                pdf.save('증권신고서.pdf');
                window.close();
            } catch (error) {
                console.error('PDF 생성 중 오류:', error);
                alert('PDF 생성 중 오류가 발생했습니다.');
                window.close();
            }
        }
    </script>
</body>
</html>`

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(fullHTML)
      printWindow.document.close()
    }
  } catch (error) {
    console.error("PDF 저장 중 오류 발생:", error)
    alert("PDF 저장 중 오류가 발생했습니다.")
  }
}

export const handleSaveDocx = async (documentContent: string) => {
  try {
    const htmlToText = (html: string) => {
      const div = document.createElement("div")
      div.innerHTML = html
      return div.textContent || div.innerText || ""
    }

    const content = documentContent || getInitialDocumentHTML()
    const textContent = htmlToText(content)

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "증권신고서.txt"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("텍스트 파일로 저장되었습니다. DOCX 형식은 추후 업데이트 예정입니다.")
  } catch (error) {
    console.error("저장 중 오류 발생:", error)
    alert("저장 중 오류가 발생했습니다.")
  }
}
