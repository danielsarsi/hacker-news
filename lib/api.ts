export interface Item {
  id: number;
  deleted?: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt";
  by: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: Item;
  poll?: number;
  kids?: number[];
  url: string;
  score: number;
  title: string;
  parts?: number[];
  descendants?: number;
}

const API_URL = "https://hacker-news.firebaseio.com/v0";

export async function obter(url: string) {
  const req = await fetch(url);
  const json = await req.json();
  return json;
}

export async function obterItem(id: number): Promise<Item> {
  const req = await obter(`${API_URL}/item/${id}.json`);
  return req;
}

export async function obterTopStories(): Promise<number[]> {
  const req = await obter(`${API_URL}/topstories.json`);
  return req;
}
