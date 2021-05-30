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

export async function obter(url: string) {
  const req = await fetch(`${API_URL}${url}`);

  return req.json();
}

export async function obterItem(id: number): Promise<Item> {
  const req = await obter(`/item/${id}.json`);
  return req;
}

export async function obterTopico(
  topico: string,
  pagina: number
): Promise<Story[]> {
  const req = await obter(`/${topico}/${pagina}.json`);

  return req;
}
