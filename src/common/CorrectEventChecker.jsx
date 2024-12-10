import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";

import { findEvent } from "../util/helperfunctions";

export default function CorrectEventChecker({
  selectedEventId,
  eventIdInTicket,
  isCorrectEvent,
  events,
}) {
  const selectedEventName = findEvent(selectedEventId, events)?.name;
  const eventNameInTicket = findEvent(eventIdInTicket, events)?.name;

  if (selectedEventId == 0 && eventIdInTicket == 0) {
    return <div></div>; // No output if IDs are not set (ie. have the initial value 0)
  }

  return (
    <div
      className={`mt-5 flex items-center rounded-md p-4 ${
        isCorrectEvent ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
      }`}>
      {isCorrectEvent ? (
        <>
          <CheckCircleIcon className='h-5 w-5 text-green-500 mr-2' />
          <p className='text-sm font-medium'>Correct event</p>
        </>
      ) : eventIdInTicket == 0 ? (
        <>
          <ExclamationCircleIcon className='h-5 w-5 text-red-500 mr-2' />
          <p className='text-sm font-medium'>Please give a ticket number.</p>
        </>
      ) : selectedEventId != 0 ? (
        <>
          <ExclamationCircleIcon className='h-5 w-5 text-red-500 mr-2' />
          <p className='text-sm font-medium'>
            This ticket is not valid for the selected event! Selected event is{" "}
            <b>{selectedEventName}</b>, but this ticket is for{" "}
            <b>{eventNameInTicket}</b>
          </p>
        </>
      ) : (
        <>
          <ExclamationCircleIcon className='h-5 w-5 text-red-500 mr-2' />
          <p className='text-sm font-medium'>
            Please select an event! This ticket is for{" "}
            <b>{eventNameInTicket}</b>
          </p>
        </>
      )}
    </div>
  );
}
