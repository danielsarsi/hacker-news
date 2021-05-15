import axios from "axios";
import { setupCache } from "axios-cache-adapter";

const API_URL = "https://hacker-news.firebaseio.com/v0";

const cache = setupCache({
  maxAge: 60 * 1000,
});

const api = axios.create({
  adapter: cache.adapter,
  baseURL: API_URL,
});

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
  const req = await api.get(url);
  const json = req.data;
  return json;
}

export async function obterItem(id: number): Promise<Item> {
  const req = await obter(`/item/${id}.json`);
  return req;
}

export async function obterTopStories(): Promise<number[]> {
  const req = await obter(`/topstories.json`);
  return req;
}
