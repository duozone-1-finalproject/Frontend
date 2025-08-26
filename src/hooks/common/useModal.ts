// src/hooks/common/useModal.ts
import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

export const useModal = (initialState: boolean = false) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: initialState,
    data: undefined,
  });

  const openModal = useCallback((data?: any) => {
    setModalState({
      isOpen: true,
      data,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      data: undefined,
    });
  }, []);

  const toggleModal = useCallback((data?: any) => {
    setModalState(prev => ({
      isOpen: !prev.isOpen,
      data: prev.isOpen ? undefined : data,
    }));
  }, []);

  return {
    // 상태
    isOpen: modalState.isOpen,
    data: modalState.data,
    
    // 액션 함수
    openModal,
    closeModal,
    toggleModal,
  };
};