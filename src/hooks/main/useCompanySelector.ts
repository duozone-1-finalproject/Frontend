// hooks/main/useCompanySelector.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dartViewerApi } from '../../api/dartViewerApi';

interface Company {
  corpCode: string;
  companyName: string;
}

export const useCompanySelector = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 회사 목록 로드 (캐시 우선)
  const loadCompanies = async (userId: number) => {
    try {
      setError(null);
      setIsLoading(true);

      const companiesData = await dartViewerApi.fetchAllCompanies(userId);
      const companies = companiesData || [];

      setCompanies(companies);
    } catch (err: any) {
      console.error('회사 목록 로드 오류:', err);
      setError('회사 목록을 불러오는데 실패했습니다.');
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 회사 선택 시 DartViewer로 이동
  const handleCompanySelect = (company: Company) => {
    const params = new URLSearchParams({
      corpCode: company.corpCode,
      companyName: company.companyName
    });
    navigate(`/dartviewer?${params.toString()}`);
  };

  return {
    companies,
    isLoading,
    error,
    loadCompanies,
    handleCompanySelect
  };
};