import { Close } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import { CalendarViewPanel } from './components/CalendarViewPanel';
import { EventFormPanel } from './components/EventFormPanel';
import { EventListPanel } from './components/EventListPanel';
import { useCalendarView } from './hooks/useCalendarView.ts';
import { useEventForm } from './hooks/useEventForm.ts';
import { useEventOperations } from './hooks/useEventOperations.ts';
import { useNotifications } from './hooks/useNotifications.ts';
import { useSearch } from './hooks/useSearch.ts';
import { Event, EventForm } from './types';
import { getWeekDates, getWeeksAtMonth } from './utils/dateUtils';
import { findOverlappingEvents } from './utils/eventOverlap';
// no-op

const categories = ['업무', '개인', '가족', '기타'];

// moved to CalendarViewPanel

const notificationOptions = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
];

function App() {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    editingEvent,
    setEditingEvent,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
    editEvent,
    // 2.2 제외 날짜 관련 상태 (훅에서 제공)
    excludeDates,
    setExcludeDates,
    weekdays,
    setWeekdays,
  } = useEventForm();

  const { events, saveEvent, deleteEvent, updateBulkEvents, deleteBulkEvents } = useEventOperations(
    Boolean(editingEvent),
    () => setEditingEvent(null)
  );

  const { notifications, notifiedEvents, setNotifications } = useNotifications(events);
  const { view, setView, currentDate, holidays, navigate } = useCalendarView();
  const { searchTerm, filteredEvents, setSearchTerm } = useSearch(events, currentDate, view);

  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkEditTitle, setBulkEditTitle] = useState('');
  const [updateScope, setUpdateScope] = useState<'single' | 'all'>('single');
  const [deleteScope, setDeleteScope] = useState<'single' | 'all'>('single');
  // 확인 다이얼로그는 선택된 삭제 대상 유무로 파생(open)되도록 상태 축소
  // const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      enqueueSnackbar('필수 정보를 모두 입력해주세요.', { variant: 'error' });
      return;
    }

    if (startTimeError || endTimeError) {
      enqueueSnackbar('시간 설정을 확인해주세요.', { variant: 'error' });
      return;
    }

    const eventData: Event | EventForm = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
        ...(excludeDates.length ? { excludeDates } : {}),
        ...(repeatType === 'weekly' && weekdays.length ? { weekdays } : {}),
      },
      notificationTime,
    };

    const overlapping = findOverlappingEvents(eventData, events);
    if (overlapping.length > 0) {
      setOverlappingEvents(overlapping);
    } else {
      // 편집 + 모든 반복 일정 수정 선택 시: 동일 repeat.id 전체 일괄 수정
      if (
        editingEvent &&
        updateScope === 'all' &&
        editingEvent.repeat.type !== 'none' &&
        editingEvent.repeat.id
      ) {
        const groupId = editingEvent.repeat.id;
        const updatedGroup = events
          .filter((e) => e.repeat.id === groupId)
          .map((e) => ({
            ...e,
            title,
            date,
            startTime,
            endTime,
            description,
            location,
            category,
            notificationTime,
          }));
        await updateBulkEvents(updatedGroup);
        setEditingEvent(null);
        resetForm();
      } else {
        // 편집 + 이 일정만 수정: 단일화 처리하여 저장
        if (editingEvent && updateScope === 'single' && editingEvent.repeat.type !== 'none') {
          (eventData as Event).repeat = { type: 'none', interval: 1 } as Event['repeat'];
        }
        await saveEvent(eventData);
        resetForm();
      }
    }
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const weeks = useMemo(() => getWeeksAtMonth(currentDate), [currentDate]);
  const notificationLabelByValue = useMemo(
    () => new Map(notificationOptions.map(({ value, label }) => [value, label])),
    []
  );
  const eventsByDateString = useMemo(() => {
    const dateStringToEvents = new Map<string, Event[]>();
    for (const eventItem of filteredEvents) {
      const dateKey = new Date(eventItem.date).toDateString();
      const eventsOnDate = dateStringToEvents.get(dateKey) ?? [];
      eventsOnDate.push(eventItem);
      dateStringToEvents.set(dateKey, eventsOnDate);
    }
    return dateStringToEvents;
  }, [filteredEvents]);
  const eventsByDay = useMemo(() => {
    const dayToEventsMap = new Map<number, Event[]>();
    for (const eventItem of filteredEvents) {
      const dayOfMonth = new Date(eventItem.date).getDate();
      const eventsOnDay = dayToEventsMap.get(dayOfMonth) ?? [];
      eventsOnDay.push(eventItem);
      dayToEventsMap.set(dayOfMonth, eventsOnDay);
    }
    return dayToEventsMap;
  }, [filteredEvents]);

  // moved to CalendarViewPanel

  return (
    <Box sx={{ width: '100%', height: '100vh', margin: 'auto', p: 5 }}>
      <Stack direction="row" spacing={6} sx={{ height: '100%' }}>
        <Stack spacing={2} sx={{ width: '20%' }}>
          <EventFormPanel
            isEditing={Boolean(editingEvent)}
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            startTime={startTime}
            endTime={endTime}
            startTimeError={startTimeError}
            endTimeError={endTimeError}
            handleStartTimeChange={handleStartTimeChange}
            handleEndTimeChange={handleEndTimeChange}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            category={category}
            setCategory={setCategory}
            categories={categories}
            notificationTime={notificationTime}
            setNotificationTime={setNotificationTime}
            notificationOptions={notificationOptions}
            isRepeating={isRepeating}
            setIsRepeating={setIsRepeating}
            repeatType={repeatType}
            setRepeatType={setRepeatType}
            repeatInterval={repeatInterval}
            setRepeatInterval={setRepeatInterval}
            repeatEndDate={repeatEndDate}
            setRepeatEndDate={setRepeatEndDate}
            weekdays={weekdays}
            setWeekdays={setWeekdays}
            excludeDates={excludeDates}
            setExcludeDates={setExcludeDates}
            onSubmit={addOrUpdateEvent}
            updateScope={updateScope}
            setUpdateScope={setUpdateScope}
            deleteScope={deleteScope}
            setDeleteScope={setDeleteScope}
          />
        </Stack>

        <CalendarViewPanel
          currentDate={currentDate}
          view={view}
          setView={setView}
          weekDates={weekDates}
          weeks={weeks}
          holidays={holidays}
          navigate={navigate}
          eventsByDateString={eventsByDateString}
          eventsByDay={eventsByDay}
          notifiedEvents={notifiedEvents}
        />

        <EventListPanel
          events={events}
          filteredEvents={filteredEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          notifiedEvents={notifiedEvents}
          notificationLabelByValue={notificationLabelByValue}
          editEvent={editEvent}
          deleteScope={deleteScope}
          setPendingDeleteIds={setPendingDeleteIds}
          deleteEvent={deleteEvent}
          setBulkEditOpen={setBulkEditOpen}
          deleteBulkEvents={deleteBulkEvents}
        />
      </Stack>

      <Dialog open={overlappingEvents.length > 0} onClose={() => setOverlappingEvents([])}>
        <DialogTitle>일정 겹침 경고</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            다음 일정과 겹칩니다:
            {overlappingEvents.map((event) => (
              <Typography key={event.id}>
                {event.title} ({event.date} {event.startTime}-{event.endTime})
              </Typography>
            ))}
            계속 진행하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverlappingEvents([])}>취소</Button>
          <Button
            color="error"
            onClick={() => {
              setOverlappingEvents([]);
              saveEvent({
                id: editingEvent ? editingEvent.id : undefined,
                title,
                date,
                startTime,
                endTime,
                description,
                location,
                category,
                repeat: {
                  type: isRepeating ? repeatType : 'none',
                  interval: repeatInterval,
                  endDate: repeatEndDate || undefined,
                  ...(excludeDates.length ? { excludeDates } : {}),
                  ...(repeatType === 'weekly' && weekdays.length ? { weekdays } : {}),
                },
                notificationTime,
              });
            }}
          >
            계속 진행
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkEditOpen} onClose={() => setBulkEditOpen(false)}>
        <DialogTitle>그룹 수정</DialogTitle>
        <DialogContent>
          <DialogContentText>선택된 이벤트들의 제목을 일괄 변경합니다.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="새 제목"
            fullWidth
            variant="standard"
            value={bulkEditTitle}
            onChange={(e) => setBulkEditTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkEditOpen(false)}>취소</Button>
          <Button
            onClick={async () => {
              const updated = events
                .filter((e) => selectedIds.includes(e.id))
                .map((e) => ({ ...e, title: bulkEditTitle }));
              await updateBulkEvents(updated as Event[]);
              setBulkEditOpen(false);
              setSelectedIds([]);
              setSelectionMode(false);
              setBulkEditTitle('');
            }}
            disabled={!bulkEditTitle}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pendingDeleteIds.length > 0} onClose={() => setPendingDeleteIds([])}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteScope === 'all'
              ? '정말 모든 반복 일정을 삭제하시겠습니까?'
              : '정말 이 일정을 삭제하시겠습니까?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteIds([])}>취소</Button>
          <Button
            color="error"
            onClick={async () => {
              await deleteBulkEvents(pendingDeleteIds);
              setPendingDeleteIds([]);
              setPendingDeleteIds([]);
            }}
          >
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {notifications.length > 0 && (
        <Stack position="fixed" top={16} right={16} spacing={2} alignItems="flex-end">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              severity="info"
              sx={{ width: 'auto' }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setNotifications((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Close />
                </IconButton>
              }
            >
              <AlertTitle>{notification.message}</AlertTitle>
            </Alert>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default App;
