import { AccordionItem, AccordionItemProps } from "@szhsin/react-accordion";
import { BiChevronUp } from "react-icons/bi";

export const CustomAccordionItem = ({
  header,
  ...rest
}: AccordionItemProps) => (
  <AccordionItem
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <BiChevronUp
          size={20}
          className={`ml-auto transition-transform duration-200 ease-out ${
            isEnter && "rotate-180"
          }`}
        />
      </>
    )}
    className="border-b border-[#DDD]"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full py-3 px-2 text-left ${isEnter && ""}`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-2" }}
  />
);
