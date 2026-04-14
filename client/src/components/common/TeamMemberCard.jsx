import { useState } from "react";
import { Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * TeamMemberCard
 * Used on: Team page
 *
 * Props:
 *   image       — photo URL
 *   name        — full name
 *   role        — job title
 *   roleColor   — 'green' | 'orange' (alternates per design)
 *   bio         — biography text
 *   linkedin    — LinkedIn profile URL
 *   email       — email address
 */
export default function TeamMemberCard({
  image,
  name,
  role,
  roleColor = "green",
  bio,
  linkedin,
  email,
  className,
}) {
  const [copied, setCopied] = useState(false);

  const roleColors = {
    green: "text-primary-600",
    orange: "text-secondary-500",
  };

  const handleEmailCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("card-hover flex flex-col", className)}>
      {/* Photo */}
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-heading-md font-semibold text-neutral-900">
          {name}
        </h3>
        <p
          className={cn(
            "text-body-sm font-medium mt-0.5 mb-3",
            roleColors[roleColor],
          )}
        >
          {role}
        </p>
        {bio && (
          <p className="text-body-sm text-neutral-500 flex-1 line-clamp-5">
            {bio}
          </p>
        )}

        {/* Social links */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-box-sm hover:bg-primary-200 transition-colors"
              aria-label={`${name} LinkedIn`}
            >
              <Linkedin size={16} />
            </a>
          )}
          {email && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  console.log("Email button clicked!", email);
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard
                    .writeText(email)
                    .then(() => {
                      console.log("Email copied to clipboard!");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    })
                    .catch((err) => console.error("Copy failed:", err));
                }}
                className="icon-box-sm hover:bg-primary-200 transition-colors"
                style={{
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  cursor: "pointer",
                  border: "none",
                  padding: "0.5625rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={`Copy email for ${name}`}
              >
                <Mail size={16} />
              </button>
              {copied && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 0.5rem)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#111827",
                    color: "white",
                    fontSize: "0.75rem",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 50,
                  }}
                >
                  Email copied
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
