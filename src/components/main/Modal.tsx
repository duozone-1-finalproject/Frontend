import React, { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import axios from '../../api/axios';


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
}

const CompanyList: React.FC<CompanyListProps> = ({ companies, isLoading }) => {
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
          onClick={() => alert(`${company.corpName} 선택됨!`)}
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
}

export const CompanySearchModal: React.FC<CompanySearchModalProps> = ({ isOpen, onClose }) => {
  // 상태 관리: 검색어, 기업 목록, 로딩 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 검색어가 없으면 API를 호출하지 않고 목록을 비웁니다.
    if (!searchTerm) {
      setCompanies([]);
      return;
    }

    // 사용자가 타이핑을 멈췄을 때만 API를 호출하기 위한 Debounce 로직
    const delayDebounceFn = setTimeout(() => {
      
      // async/await를 사용하기 위한 비동기 함수를 선언합니다.
      const search = async () => {
        setIsLoading(true);
        try {
          // 1. axios.get을 사용하여 API를 호출합니다.
          const response = await axios.get(`/api/companies/search?keyword=${searchTerm}`);
          
          // 3. axios는 응답 데이터를 response.data에 자동으로 담아줍니다.
          //    백엔드 응답 구조에 맞춰 데이터를 설정합니다.
          console.log("API Response:", response.data); // 디버깅용 로그
          setCompanies(response.data.content || response.data.companies || []); /////////////////////////////여기 문제있음 해결법 찾자

        } catch (error) {
          console.error("Error fetching companies:", error);
          setCompanies([]); // 에러 발생 시 목록을 비웁니다.
        } finally {
          // 4. 요청이 성공하든 실패하든 항상 로딩 상태를 해제합니다.
          setIsLoading(false);
        }
      };

      search(); // 선언한 비동기 함수를 호출합니다.

    }, 500); // 500ms 지연

    // effect가 재실행되기 전에 이전 타이머를 정리합니다. (중요)
    return () => clearTimeout(delayDebounceFn);

  }, [searchTerm]); // searchTerm이 변경될 때마다 이 effect가 실행됩니다.

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="기업 선택(100개씩 검색)"
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
          <CompanyList companies={companies} isLoading={isLoading} />
        </div>
      </>
    </Modal>
  );
};



export default CompanySearchModal; // 필요에 따라 export