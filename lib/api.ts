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
  topic: Topicos;
  url: string;
  maxPages: number;
}

export const TOPICOS = ["news", "newest", "ask", "show", "jobs"] as const;

export type Topicos = typeof TOPICOS[number];

export async function obter<T>(url: string) {
  const req = await fetch(`${API_URL}${url}`);
  return req.json() as Promise<T>;
}

export async function obterTopicos() {
  return obter<API>("/");
}

export async function obterTopico(topico: string, pagina: number) {
  return obter<Story[]>(`/${topico}/${pagina}.json`);
}

export async function obterItem(id: number) {
  return obter<Item>(`/item/${id}.json`);
}
