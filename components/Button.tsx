import { ReactChildren, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactChildren | string;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const styleByVariant = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "primary":
    default:
      return "bg-red-300";
    case "secondary":
      return "bg-green-300";
  }
};

const Button = ({
  children,
  disabled = false,
  className = "",
  variant = "primary",
  onClick,
}: ButtonProps): JSX.Element => {
  const styles = `text-white rounded outline-none transition duration-500 ease-in-out disabled:opacity-50  ${styleByVariant(
    variant
  )} `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles + className}
    >
      {children}
    </button>
  );
};

export { Button };
