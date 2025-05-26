"use client";
import React, { useState } from "react";

const RangeSlider: React.FC<{
  initialValue?: number;
  label?: string;
  units?: string;
  disabled?: boolean;
  onChange?: (value: number) => void;
  max?: number;
  min?: number;
  infoIcon?: React.ReactElement;
}> = ({
  disabled = false,
  initialValue = 1,
  units,
  label,
  onChange,
  min = 1,
  max = 10,
  infoIcon,
}) => {
    const [value, setValue] = useState(initialValue);

    function handleOnChange(value: number) {
      setValue(value);

      if (onChange) {
        onChange(value);
      }
    }
    return (
      <>
        {label ? (
          <label
            htmlFor="default-range"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            {label}
            {infoIcon}:{" "}
            <b>
              {value}
              {units}
            </b>
          </label>
        ) : null}
        <input
          onChange={(e) => handleOnChange(Number(e.target.value))}
          id="default-range"
          type="range"
          value={value}
          disabled={disabled}
          step="0.1"
          max={max}
          min={min}
          className="dark:bg-gray-700 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#d4dadc]"
        />
      </>
    );
  };

export default RangeSlider;
