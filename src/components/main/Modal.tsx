import axiosInstance from '../../api/axios';
import React, { useState, useEffect, ReactNode } from 'react';
import { X, Search } from 'lucide-react';

// =========================================================================
// 1. 범용 UI 컴포넌트: Modal (Presentational)
// 역할: 검은 배경과 모달의 '틀'을 제공하고, children으로 받은 내용을 보여줌
// =========================================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Escape 키로 닫기, 외부 스크롤 방지 로직은 그대로 유지
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* 모달 창 */}
      <div
        className="relative bg-white rounded-lg shadow-xl flex flex-col"
        style={{ width: '500px', height: '600px' }}
      >
        {/* 헤더 */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {/* 컨텐츠 (children) */}
        <div className="flex-grow overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. 범용 UI 컴포넌트: CompanyList (Presentational)
// 역할: 기업 데이터 배열을 받아 UI 목록으로 렌더링
// =========================================================================

// --- 데이터 타입을 위한 Interface 정의 ---
interface Company {
  corpCode: string;
  corpName: string;
}

interface CompanyListProps {
  companies: Company[];
  isLoading: boolean;
  onSelectCompany: (corpCode: string, corpName: string) => void;
  error?: string;
}

const CompanyList: React.FC<CompanyListProps> = ({ 
  companies, 
  isLoading, 
  onSelectCompany,
  error 
}) => {
  const handleSelectCompany = (company: Company) => {
    // window.confirm이 true(예)를 반환하면 onSelectCompany 함수 실행
    if (window.confirm(`'${company.corpName}'을(를) 선택하시겠습니까?`)) {
      onSelectCompany(company.corpCode, company.corpName);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <div className="mt-2">검색 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <div className="mb-2">❌ 검색 중 오류가 발생했습니다</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        검색 결과가 없습니다.
        <div className="text-sm mt-1">다른 키워드로 검색해보세요.</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {companies.map(company => (
        <div
          key={company.corpCode}
          className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
          onClick={() => handleSelectCompany(company)}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{company.corpName}</span>
            <span className="text-sm text-gray-500 font-mono">{company.corpCode}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// =========================================================================
// 3. 기능 특화 컴포넌트: CompanySearchModal (Container)
// 역할: 상태 관리, API 호출 등 '기업 검색'에 필요한 모든 로직을 담당
// =========================================================================
interface CompanySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCompany: (corpCode: string, corpName: string) => void; 
}

export const CompanySearchModal: React.FC<CompanySearchModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectCompany 
}) => {
  // 상태 관리: 검색어, 기업 목록, 로딩 상태, 에러
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setCompanies([]);
      setError('');
    }
  }, [isOpen]);

  // API 호출 로직 (Debounce 적용)
  useEffect(() => {
    // 검색어가 없거나 너무 짧으면 API 호출 방지
    if (!searchTerm || searchTerm.trim().length < 2) {
      setCompanies([]);
      setError('');
      return;
    }
  
    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      
      try {
        console.log('🔍 기업 검색 API 호출:', searchTerm);
        
        // 🔧 실제 API 엔드포인트로 수정 필요
        // 옵션 1: 다른 엔드포인트 시도
        // const response = await axiosInstance.get('/api/company/search', {
        // 옵션 2: 다른 경로 시도  
        // const response = await axiosInstance.get('/companies/search', {
        // 옵션 3: DART API 직접 호출 (CORS 문제 가능)
        // const response = await axiosInstance.get('/dart/companies', {
        
        const response = await axiosInstance.get('/api/companies/search', {
          params: { 
            keyword: searchTerm.trim(),
            limit: 50  // 검색 결과 제한
          }
        });
        
        console.log('📡 API 응답:', response.data);
        console.log('📡 응답 타입:', typeof response.data);
        console.log('📡 응답 상태:', response.status);
        
        // 🚨 HTML 응답 체크 (로그인 페이지 등)
        if (typeof response.data === 'string' && response.data.includes('<form') && response.data.includes('login')) {
          throw new Error('API 엔드포인트가 존재하지 않거나 인증이 필요합니다. 백엔드 개발자에게 문의하세요.');
        }
        
        // API 응답 구조에 따라 데이터 추출
        let companyData: Company[] = [];
        
        if (response.data) {
          // 백엔드 CompanyOverviewListResponseDto 구조 처리
          if (response.data.companyOverviews && Array.isArray(response.data.companyOverviews)) {
            // CompanyOverview 엔티티를 Company 인터페이스에 맞게 매핑
            companyData = response.data.companyOverviews.map((company: any) => ({
              corpCode: company.corpCode || '',
              corpName: company.corpName || ''
            }));
          }
          // 직접 배열인 경우 (test 엔드포인트 등)
          else if (Array.isArray(response.data)) {
            companyData = response.data.map((company: any) => ({
              corpCode: company.corpCode || '',
              corpName: company.corpName || ''
            }));
          }
          // 다른 가능한 구조들
          else if (response.data.companies && Array.isArray(response.data.companies)) {
            companyData = response.data.companies;
          }
          else if (response.data.content && Array.isArray(response.data.content)) {
            companyData = response.data.content;
          }
          else if (response.data.data && Array.isArray(response.data.data)) {
            companyData = response.data.data;
          }
          // 예상치 못한 응답 구조
          else {
            console.warn('예상치 못한 API 응답 구조:', response.data);
            throw new Error('API 응답 형식이 올바르지 않습니다.');
          }
        } else {
          throw new Error('API 응답이 비어있습니다.');
        }
        
        console.log('✅ 처리된 기업 데이터:', companyData);
        setCompanies(companyData);
        
        if (companyData.length === 0) {
          setError('검색 결과가 없습니다.');
        }
        
      } catch (error: any) {
        console.error('❌ 기업 검색 API 오류:', error);
        
        let errorMessage = '검색 중 오류가 발생했습니다.';
        
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.statusText;
          
          switch (status) {
            case 400:
              errorMessage = `잘못된 요청입니다: ${message}`;
              break;
            case 401:
              errorMessage = '인증이 필요합니다. 로그인 후 다시 시도해주세요.';
              break;
            case 404:
              errorMessage = 'API 엔드포인트를 찾을 수 없습니다.';
              break;
            case 500:
              errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
              break;
            default:
              errorMessage = `서버 오류 (${status}): ${message}`;
          }
        } else if (error.request) {
          errorMessage = '서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.';
        }
        
        setError(errorMessage);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms 지연
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 회사 선택 처리 (모달 닫기 포함)
  const handleSelectCompany = (corpCode: string, corpName: string) => {
    onSelectCompany(corpCode, corpName);
    onClose(); // 🎯 모달 닫기
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="기업 선택"
    >
      <>
        {/* 검색창 UI */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="기업명을 입력하세요... (최소 2글자)"
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
          </div>
          {/* 검색 상태 표시 */}
          <div className="mt-2 text-sm text-gray-500">
            {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
              <span className="text-orange-600">최소 2글자 이상 입력해주세요.</span>
            )}
            {companies.length > 0 && (
              <span className="text-blue-600">{companies.length}개의 기업을 찾았습니다.</span>
            )}
          </div>
        </div>

        {/* 검색 결과 목록 UI */}
        <div className="p-4">
          <CompanyList 
            companies={companies} 
            isLoading={isLoading}
            error={error}
            onSelectCompany={handleSelectCompany}
          />
        </div>
      </>
    </Modal>
  );
};

export default CompanySearchModal;