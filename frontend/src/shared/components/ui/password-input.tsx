import { Input } from "@/shared/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import {
  useState,
  type ComponentProps,
  type ChangeEvent,
} from "react"
import {
  InputGroupButton,
} from "@/shared/components/ui/input-group"
import clsx from "clsx"

export function PasswordInput({
  onChange,
  value,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) {
  const [showPassword, setShowPassword] = useState(false)

  const Icon = showPassword ? EyeOffIcon : EyeIcon

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
  }

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        {...props}
        className={clsx(props.className, 'pr-8')}
        onChange={handleChange}
        value={value}
      />
      <InputGroupButton
        size="icon-xs"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(p => !p)}
      >
        <Icon className="size-4.5" />
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </InputGroupButton>
    </div>
  );
}