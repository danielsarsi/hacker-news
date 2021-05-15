const API_URL = "https://hacker-news.firebaseio.com/v0";

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
  score?: number;
  title: string;
  parts?: number[];
  descendants?: number;
}

export async function obter(url: string) {
  const req = await fetch(`${API_URL}${url}`);
  return req.json();
}

export async function obterItem(id: number): Promise<Item> {
  const req = await obter(`/item/${id}.json`);
  return req;
}

export async function obterTopStories(): Promise<number[]> {
  const req = await obter(`/topstories.json`);
  return req;
}
