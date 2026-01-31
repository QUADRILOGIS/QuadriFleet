type AlertButtonVariant = "warning" | "danger" | "info" | "success";

interface AlertButtonProps {
  icon: string;
  label: string;
  count?: number;
  variant?: AlertButtonVariant;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const variantStyles: Record<AlertButtonVariant, { bg: string; hover: string; text: string }> = {
  warning: { bg: "bg-orange-50", hover: "hover:bg-orange-100", text: "text-orange-600" },
  danger: { bg: "bg-red-50", hover: "hover:bg-red-100", text: "text-red-600" },
  info: { bg: "bg-blue-50", hover: "hover:bg-blue-100", text: "text-blue-600" },
  success: { bg: "bg-green-50", hover: "hover:bg-green-100", text: "text-green-600" },
};

export default function AlertButton({ 
  icon, 
  label, 
  count,
  variant = "info",
  onClick,
  className = ""
}: AlertButtonProps) {
  const styles = variantStyles[variant];
  
  const displayLabel = count !== undefined ? `${count} ${label}` : label;
  
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${styles.bg} ${styles.hover} ${styles.text} rounded-lg transition-colors text-sm font-medium ${className}`}
    >
      <i className={`${icon} text-sm`} />
      <span>{displayLabel}</span>
    </button>
  );
}
