import { ReactChildren, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactChildren | string;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  autoFocus?: boolean;
  [x: string]: unknown;
}

const styleByVariant = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "primary":
    default:
      return "bg-gray-100 text-gray-900";
    case "secondary":
      return "bg-gray-900 text-gray-100";
  }
};

const Button = ({
  children,
  disabled = false,
  className = "",
  variant = "primary",
  onClick,
  autoFocus = false,
  ...rest
}: ButtonProps): JSX.Element => {
  const styles = `rounded outline-none transition duration-500 ease-in-out disabled:opacity-80  ${styleByVariant(
    variant
  )} `;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles + className}
      autoFocus={autoFocus}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
