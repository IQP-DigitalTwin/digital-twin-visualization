import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import moment from "moment";
import "moment/locale/fr";

// @ts-ignore
registerLocale("fr", fr);

const WeekPicker = ({
  disabled,
  onChange,
}: {
  disabled?: boolean;
  onChange: (weekNumber: number) => void;
}) => {
  const [startDate, setStartDate] = useState(
    moment("15/02/2023", "DD/MM/YYYY"),
  );
  const handleWeekNumberChange = (date: Date) => {
    setStartDate(moment(date));
    onChange(moment(date).isoWeek());
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Semaine de la limitation
      </label>
      <DatePicker
        selected={startDate.toDate()}
        value={startDate.locale("fr").format("WW (MMMM)")}
        onChange={(date) => handleWeekNumberChange(date as Date)}
        showWeekNumbers
        locale="fr"
        calendarStartDay={1}
        disabled={disabled}
        showWeekPicker
        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        wrapperClassName="w-full"
      />
    </div>
  );
};

export default WeekPicker;
