import { useState } from "react";
import Calendar from "react-calendar";
import styled from "styled-components";

const StyledCalendarContainer = styled.div`
  .react-calendar {
    width: 350px;
    max-width: 100%;
    font-family: "Play", sans-serif;
    line-height: 4rem;
    background: var(--glass-background);
    box-shadow: var(--glass-effect);
    border: solid 1px #fff;
    border-radius: 1rem;
    margin: 0 auto;
    position: absolute;
    top: 20rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    padding: 0.8rem 1.6rem;
  }

  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }

  .react-calendar__navigation {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .react-calendar__navigation button {
    min-width: 30px;
    background: none;
  }

  .react-calendar__navigation button:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-size: 1.2rem;
    font-weight: bold;
    color: #b9b9b9;
    text-decoration: none;
  }

  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
  }

  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-size: 0.75em;
    font-weight: bold;
  }

  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }

  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 2.8rem 0.5em;
    border-radius: 1rem;
  }

  .react-calendar__tile {
    border-radius: 1rem;
    max-width: 100%;
    padding: 0.75em 0.5em;
    background: none;
    text-align: center;
    line-height: 16px;
    font: inherit;
    font-size: 0.833em;
  }

  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }

  .react-calendar__tile--now {
    background: #2745e1;
  }

  .react-calendar__tile--active {
    background: #006edc;
    color: white;
  }

  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #1087ff;
  }

  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }
`;

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarComponent: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <StyledCalendarContainer>
      <Calendar maxDetail="month" onChange={onChange} value={value} />
    </StyledCalendarContainer>
  );
};

export default CalendarComponent;
