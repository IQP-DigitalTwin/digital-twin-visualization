import { PropsWithChildren, useEffect, useRef } from "react";
import { FaWindowClose } from "react-icons/fa";
export const Modal = ({
  isOpen,
  children,
  className,
  onClose,
}: PropsWithChildren<{
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}>) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [isOpen]);

  return (
    <>
      <div
        className={`${className || ""} hidden rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark print:block `}
      >
        {children}
      </div>
      <dialog
        ref={ref}
        onCancel={onClose}
        className="w-[50%] rounded p-5 outline-none print:hidden"
      >
        <div>
          <FaWindowClose
            className="absolute right-2 top-2 cursor-pointer text-primary"
            onClick={onClose}
          />
        </div>
        <div className="pt-5">{children}</div>
      </dialog>
    </>
  );
};
