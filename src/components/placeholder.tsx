import { LucideMessageSquareWarning } from "lucide-react";
import { cloneElement } from "react";

type PlaceHolderProps = {
  label: string;
  icon?: React.ReactElement;
  button?: React.ReactElement;
};

const PlaceHolder = ({
  label,
  icon = <LucideMessageSquareWarning />,
  button = <div />,
}: PlaceHolderProps) => {
  return (
    <div className="flex-1 self-center flex flex-col items-center justify-center">
      {cloneElement(icon, {
        className: "w-16 h-16",
      } as React.HTMLAttributes<HTMLElement>)}
      <h2 className="text-lg text-center">{label}</h2>
      {cloneElement(button, {
        className: "h-14",
      } as React.HTMLAttributes<HTMLElement>)}
    </div>
  );
};

export { PlaceHolder };
