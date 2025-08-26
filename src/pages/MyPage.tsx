// pages/MyPage.tsx (리팩토링된 버전)
import React from 'react';
import { useMyPage } from '../hooks/pages/useMyPage';
import { Loading } from '../components/common';
import {
  MyPageHeader,
  ProfileSection,
  ProjectsSection,
  FavoritesSection,
  SettingsSection,
  CalendarSection
} from '../components/mypage/MyPageSections';
import { EventModal } from '../components/mypage/EventModal';

const MyPage: React.FC = () => {
  const {
    currentUser,
    selectedDate,
    setSelectedDate,
    currentMonth,
    events,
    projects,
    showEventModal,
    setShowEventModal,
    editingEvent,
    setEditingEvent,
    modalDate,
    handleLogout,
    navigateMonth,
    getEventsForDate,
    getProjectDeadlinesForDate,
    getCategoryColor,
    openEventModal,
    saveEvent,
    deleteEvent,
    navigate
  } = useMyPage();

  // 로딩 중일 때
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Loading size="lg" text="사용자 정보 로딩 중..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <MyPageHeader 
        onBackToMain={() => navigate('/main')}
        onLogout={handleLogout}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProfileSection user={currentUser} />

        {/* 2x2 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProjectsSection 
            projects={projects}
            onViewAll={() => navigate('/edit')}
          />
          <FavoritesSection />
          <SettingsSection />
          <CalendarSection
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            events={events}
            projects={projects}
            onDateSelect={setSelectedDate}
            onMonthNavigate={navigateMonth}
            onEventAdd={openEventModal}
            onEventEdit={openEventModal}
            onEventDelete={deleteEvent}
            getCategoryColor={getCategoryColor}
            getEventsForDate={getEventsForDate}
            getProjectDeadlinesForDate={getProjectDeadlinesForDate}
          />
        </div>
      </div>

      {/* 일정 추가/수정 모달 */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onSave={saveEvent}
          event={editingEvent}
          date={modalDate}
        />
      )}
    </div>
  );
};

export default MyPage;