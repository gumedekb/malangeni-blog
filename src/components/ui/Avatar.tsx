import Image from "next/image";
import { getInitials } from "@/lib/format";

/**
 * Member avatar with a three-step fallback: the uploaded picture, then the
 * Google account photo that comes free with sign-in, then initials on a solid
 * circle. Keeping the order in one place stops the header, the menu and the
 * profile page from disagreeing about which image to show.
 */
export function Avatar({
  src,
  name,
  size = 36,
  className = "",
}: {
  /** Uploaded picture or Google photo; falls back to initials when absent. */
  src?: string | null;
  /** Used for the initials fallback and the alt text. */
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const label = name ? getInitials(name) : "You";
  const base = `shrink-0 overflow-hidden rounded-full ${className}`;

  if (src) {
    return (
      <Image
        src={src}
        alt={name ? `${name}'s profile picture` : "Profile picture"}
        width={size}
        height={size}
        // Uploads are square by construction, but Google photos may not be.
        className={`${base} object-cover`}
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center bg-ink font-semibold text-white ${base}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {label}
    </span>
  );
}
