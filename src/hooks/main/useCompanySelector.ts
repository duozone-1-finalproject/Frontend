// hooks/main/useCompanySelector.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dartViewerApi } from '../../api/dartViewerApi';

interface Company {
  corpCode: string;
  companyName: string;
}

const CACHE_KEY = 'companies_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5분

interface CacheData {
  companies: Company[];
  timestamp: number;
}

export const useCompanySelector = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 캐시에서 데이터 가져오기
  const getCachedCompanies = (): Company[] | null => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      const now = Date.now();

      // 캐시가 만료되었는지 확인
      if (now - cacheData.timestamp > CACHE_DURATION) {
        sessionStorage.removeItem(CACHE_KEY);
        return null;
      }

      return cacheData.companies;
    } catch (err) {
      console.error('캐시 읽기 오류:', err);
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  // 캐시에 데이터 저장
  const setCachedCompanies = (companies: Company[]) => {
    try {
      const cacheData: CacheData = {
        companies,
        timestamp: Date.now()
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      console.error('캐시 저장 오류:', err);
    }
  };

  // 컴포넌트 마운트시 캐시에서 데이터 로드
  useEffect(() => {
    const cachedCompanies = getCachedCompanies();
    if (cachedCompanies) {
      setCompanies(cachedCompanies);
    }
  }, []);

  // 회사 목록 로드 (캐시 우선)
  const loadCompanies = async (userId: number, forceRefresh = false) => {
    try {
      setError(null);

      // 강제 새로고침이 아니면 캐시 먼저 확인
      if (!forceRefresh) {
        const cachedCompanies = getCachedCompanies();
        if (cachedCompanies) {
          setCompanies(cachedCompanies);
          return;
        }
      }

      setIsLoading(true);
      const companiesData = await dartViewerApi.fetchAllCompanies(userId);
      const companies = companiesData || [];

      setCompanies(companies);
      setCachedCompanies(companies); // 캐시에 저장
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