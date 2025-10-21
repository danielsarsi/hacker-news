import axios from "axios";

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
export type Topics = (typeof TOPICS)[number];

export class APIError extends Error {
  statusCode: number;

  constructor(statusCode: number) {
    super(`API responded with ${statusCode}`);
    this.name = "APIError";
    this.statusCode = statusCode;
  }
}

// Mock data for development when API is not accessible
const getMockData = (url: string): any => {
  if (url === "/") {
    return {
      name: "Hacker News API",
      endpoints: TOPICS.map((topic) => ({
        topic,
        url: `/${topic}/:page`,
        maxPages: 10,
      })),
    };
  }

  // Mock topic list (e.g., /news/1.json)
  if (url.match(/\/(news|newest|ask|show|jobs)\/\d+\.json/)) {
    return Array.from({ length: 30 }, (_, i) => ({
      id: 1000 + i,
      title: `Sample Story ${i + 1}`,
      points: Math.floor(Math.random() * 500),
      user: `user${i}`,
      time: Date.now() / 1000,
      time_ago: `${Math.floor(Math.random() * 24)} hours ago`,
      comments_count: Math.floor(Math.random() * 100),
      type: "story",
      url: `https://example.com/story${i}`,
      domain: "example.com",
    }));
  }

  // Mock item (e.g., /item/123.json)
  if (url.match(/\/item\/\d+\.json/)) {
    const id = parseInt(url.match(/\/item\/(\d+)\.json/)?.[1] || "0");
    return {
      id,
      title: `Sample Story ${id}`,
      points: 100,
      user: "sampleuser",
      time: Date.now() / 1000,
      time_ago: "2 hours ago",
      content: "<p>This is sample content for development.</p>",
      type: "story",
      url: "https://example.com",
      domain: "example.com",
      comments: [],
      level: 0,
      comments_count: 0,
    };
  }

  return null;
};

export async function api<T>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(`${API_URL}${url}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HackerNews-App/1.0)",
      },
      timeout: 10000,
    });

    if (response.data === null) {
      throw new APIError(404);
    }

    return response.data;
  } catch (error) {
    // Use mock data in development when API is not accessible
    if (process.env.NODE_ENV === "development") {
      console.warn(`API request failed for ${url}, using mock data`);
      const mockData = getMockData(url);
      if (mockData) {
        return mockData as T;
      }
    }

    if (axios.isAxiosError(error) && error.response) {
      throw new APIError(error.response.status);
    }
    throw error;
  }
}

export async function apiEndpoints() {
  return api<API>("/");
}

export async function apiTopic(topic: Topics, page: number) {
  return api<Story[]>(`/${topic}/${page}.json`);
}

export async function apiItem(id: number) {
  return api<Item>(`/item/${id}.json`);
}
