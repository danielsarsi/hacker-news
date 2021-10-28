import { TOPICS, Topics } from "./api";

export function isValidTopic(
  topic: string | string[] | undefined
): topic is Topics {
  return typeof topic === "string" && TOPICS.includes(topic as Topics);
}

export function isValidNumber(
  page: string | string[] | undefined
): page is string {
  return typeof page === "string" && !Number.isNaN(+page);
}
