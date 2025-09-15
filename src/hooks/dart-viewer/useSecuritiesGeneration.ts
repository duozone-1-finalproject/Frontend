// hooks/main/useSecuritiesGeneration.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SecuritiesDataService } from '../../service/securitiesDataService';
import { createV0WithTemplateData } from '../../service/dartViewerService';

interface GenerationProgress {
  step: string;
  progress: number;
}

export const useSecuritiesGeneration = () => {
  const navigate = useNavigate();
  
  // 초안 생성 관련 상태
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({ step: '', progress: 0 });
  const [generatedData, setGeneratedData] = useState<Record<string, any> | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // 증권신고서 초안 생성 핸들러
  const handleGenerateSecurities = async (companyCode: string) => {
    try {
      setIsGenerating(true);
      setGenerationProgress({ step: '초기화 중...', progress: 0 });
      
      const result = await SecuritiesDataService.generateSecuritiesData(
        companyCode,
        (step: string, progress: number) => {
          setGenerationProgress({ step, progress });
        }
      );
      
      if (result.success && result.data) {
        setGeneratedData(result.data);
        
        console.log("✅ [Hook] 증권신고서 데이터 생성 성공:", result.data);

        // 즉시 v0 버전으로 DB에 저장 (템플릿 적용된 상태로)
        const userId = 123;
        const v0Result = await createV0WithTemplateData(userId, result.data);
        
        if (v0Result.success) {
          setShowResultModal(true);
        } else {
          throw new Error(v0Result.message || "v0 버전 저장 실패");
        }
        
      } else {
        throw new Error(result.error || "데이터 생성 실패");
      }
      
    } catch (error: any) {
      alert(`증권신고서 생성 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress({ step: '', progress: 0 });
    }
  };

  // 결과 확인 후 다트뷰어로 이동
  const handleGoToViewer = () => {
    if (generatedData && generatedData.corp_code) {
      // v0가 DB에 이미 저장되었으므로 바로 이동, corpCode와 corpName을 URL 파라미터로 전달
      const params = new URLSearchParams({
        corpCode: generatedData.corp_code,
        companyName: generatedData.company_name || ''
      });
      navigate(`/dartviewer?${params.toString()}`);
    }
  };

  return {
    isGenerating,
    generationProgress,
    generatedData,
    showResultModal,
    setShowResultModal,
    handleGenerateSecurities,
    handleGoToViewer
  };
};