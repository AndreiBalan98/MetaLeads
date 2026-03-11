import { getTimeSince, getUrgencyLevel, getUrgencyColorClass } from "@/lib/leadUtils";

interface UrgencyClockProps {
  submittedAt: Date;
  size?: "sm" | "md" | "lg";
}

const UrgencyCllock = ({ submittedAt, size = "md" }: UrgencyClockProps) => {
  const level = getUrgencyLevel(submittedAt);
  const time = getTimeSince(submittedAt);
  const colorClass = getUrgencyColorClass(level);

  const sizeClass = {
    sm: "text-sm font-semibold",
    md: "text-lg font-bold",
    lg: "text-3xl font-bold",
  }[size];

  return (
    <span className={`font-display ${sizeClass} ${colorClass}`}>
      {time}
    </span>
  );
};

export default UrgencyCllock;
