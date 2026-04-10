import type { Review } from "@/types/reviewType";

export function formatReviewDate(value?: string) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function getUserName(review: Review) {
  return typeof review.user === "string" ? "Verified Customer" : review.user.fullName;
}

export function getUserId(review: Review) {
  return typeof review.user === "string" ? review.user : review.user._id;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
