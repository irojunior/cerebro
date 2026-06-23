import { config } from "../config.js";

export interface ClickUpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}

export class ClickUpError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    public payload: unknown,
  ) {
    super(`ClickUp API ${status} em ${endpoint}: ${JSON.stringify(payload)}`);
    this.name = "ClickUpError";
  }
}

/**
 * Cliente da API v2 do ClickUp. Cobre as principais entidades:
 * teams (workspaces) → spaces → folders → lists → tasks, além de
 * comments, custom fields, members, time tracking e webhooks.
 *
 * Docs: https://clickup.com/api
 */
export class ClickUpClient {
  private readonly token: string;
  private readonly baseUrl: string;

  constructor(token = config.clickup.token, baseUrl = config.clickup.baseUrl) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  async request<T = unknown>(
    endpoint: string,
    options: ClickUpRequestOptions = {},
  ): Promise<T> {
    const { method = "GET", query, body } = options;
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: this.token,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ClickUpError(response.status, endpoint, data);
    }
    return data as T;
  }

  // ---- Workspaces / Teams ----
  /** Lista os workspaces (times) aos quais o token tem acesso. */
  getTeams() {
    return this.request<{ teams: any[] }>("/team");
  }

  /** Membros do workspace. */
  getTeamMembers(teamId: string) {
    return this.request(`/team/${teamId}`);
  }

  // ---- Spaces ----
  getSpaces(teamId: string, archived = false) {
    return this.request<{ spaces: any[] }>(`/team/${teamId}/space`, {
      query: { archived },
    });
  }

  getSpace(spaceId: string) {
    return this.request(`/space/${spaceId}`);
  }

  // ---- Folders ----
  getFolders(spaceId: string, archived = false) {
    return this.request<{ folders: any[] }>(`/space/${spaceId}/folder`, {
      query: { archived },
    });
  }

  // ---- Lists ----
  getFolderLists(folderId: string, archived = false) {
    return this.request<{ lists: any[] }>(`/folder/${folderId}/list`, {
      query: { archived },
    });
  }

  /** Listas sem pasta ("folderless") dentro de um space. */
  getFolderlessLists(spaceId: string, archived = false) {
    return this.request<{ lists: any[] }>(`/space/${spaceId}/list`, {
      query: { archived },
    });
  }

  // ---- Tasks ----
  getTasks(
    listId: string,
    query: Record<string, string | number | boolean> = {},
  ) {
    return this.request<{ tasks: any[] }>(`/list/${listId}/task`, { query });
  }

  getTask(taskId: string) {
    return this.request(`/task/${taskId}`);
  }

  createTask(listId: string, body: Record<string, unknown>) {
    return this.request(`/list/${listId}/task`, { method: "POST", body });
  }

  updateTask(taskId: string, body: Record<string, unknown>) {
    return this.request(`/task/${taskId}`, { method: "PUT", body });
  }

  deleteTask(taskId: string) {
    return this.request(`/task/${taskId}`, { method: "DELETE" });
  }

  // ---- Comments ----
  getTaskComments(taskId: string) {
    return this.request<{ comments: any[] }>(`/task/${taskId}/comment`);
  }

  createTaskComment(taskId: string, body: Record<string, unknown>) {
    return this.request(`/task/${taskId}/comment`, { method: "POST", body });
  }

  // ---- Webhooks (para sync em tempo real) ----
  getWebhooks(teamId: string) {
    return this.request<{ webhooks: any[] }>(`/team/${teamId}/webhook`);
  }

  createWebhook(teamId: string, body: Record<string, unknown>) {
    return this.request(`/team/${teamId}/webhook`, { method: "POST", body });
  }
}

export const clickup = new ClickUpClient();
