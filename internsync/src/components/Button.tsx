import type { ButtonHTMLAttributes, PropsWithChildren } from "react"
import { getButtonClassName, type Variant } from "@/components/buttonStyles"

type Props = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant
  }
>

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={getButtonClassName(variant, className)}
      {...props}
    >
      {children}
    </button>
  )
}

