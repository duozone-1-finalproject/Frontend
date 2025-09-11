import React, { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';



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
  onSelectCompany: (corpCode: string) => void
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, isLoading, onSelectCompany }) => {

  const handleSelectCompany = (company: Company) => {
  // window.confirm이 true(예)를 반환하면 asd 함수 실행
  if (window.confirm(`'${company.corpName}'을(를 선택하시겠습니까?`)) {
    onSelectCompany(company.corpCode);
  }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">검색 중...</div>;
  }
  if (companies.length === 0) {
    return <div className="p-4 text-center text-gray-500">검색 결과가 없습니다.</div>;
  }
  return (
    <div className="space-y-2">
      {companies.map(company => (
        <div
          key={company.corpCode}
          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          onClick={() => handleSelectCompany(company)}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{company.corpName}</span>
            <span className="text-sm text-gray-500">{company.corpCode}</span>
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
  onSelectCompany: (corpCode: string) => void; 
}

export const CompanySearchModal: React.FC<CompanySearchModalProps> = ({ isOpen, onClose, onSelectCompany}) => {
  // 상태 관리: 검색어, 기업 목록, 로딩 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // API 호출 로직 (Debounce 적용)
  useEffect(() => {
    // 검색어가 없으면 API 호출 방지
    if (!searchTerm) {
      setCompanies([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setIsLoading(true);
      fetch(`http://localhost:8080/api/companies/search?keyword=${searchTerm}`)
        .then(res => res.json())
        .then(data => setCompanies(data.content || data.companies || []))
        .catch(error => {
          console.error("Error fetching companies:", error);
          setCompanies([]);
        })
        .finally(() => setIsLoading(false));
    }, 500); // 500ms 지연

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
              placeholder="기업명을 입력하세요..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* ... 돋보기 아이콘 SVG ... */}
          </div>
        </div>

        {/* 검색 결과 목록 UI */}
        <div className="p-4">
          <CompanyList 
            companies={companies} 
            isLoading={isLoading}
            onSelectCompany={(corpCode: string) => {
                  onSelectCompany(corpCode);
                }} />
        </div>
      </>
    </Modal>
  );
};



export default CompanySearchModal; // 필요에 따라 export