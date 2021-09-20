const API_URL = "https://api.hnpwa.com/v0";

// https://github.com/davideast/hnpwa-api/blob/main/src/api/interfaces.ts
export interface Story {
  id: number;
  title: string;
  points?: number | null;
  user?: string | null;
  time: number;
  time_ago: string;
  comments_count: number;
  type: string;
  url?: string;
  domain?: string;
}

export interface Item {
  id: number;
  title: string;
  points: number | null;
  user: string | null;
  time: number;
  time_ago: string;
  content: string;
  deleted?: boolean;
  dead?: boolean;
  type: string;
  url?: string;
  domain?: string;
  comments: Item[];
  level: number;
  comments_count: number;
}

export interface API {
  name: string;
  endpoints: APIEndpoints[];
}

export interface APIEndpoints {
  topic: Topics;
  url: string;
  maxPages: number;
}

export const TOPICS = ["news", "newest", "ask", "show", "jobs"] as const;

export type Topics = typeof TOPICS[number];

export async function api<T>(url: string) {
  const req = await fetch(`${API_URL}${url}`);
  return req.json() as Promise<T>;
}

export async function apiEndpoints() {
  return api<API>("/");
}

export async function apiTopic(topic: string, page: number) {
  return api<Story[]>(`/${topic}/${page}.json`);
}

export async function apiItem(id: number) {
  return api<Item | null>(`/item/${id}.json`);
}
