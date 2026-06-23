import { clickup, ClickUpClient } from "./clickup/client.js";

export { clickup, ClickUpClient };
export { config } from "./config.js";

/**
 * Entrypoint do cérebro. Por enquanto exporta o cliente do ClickUp;
 * a camada de sync com o Supabase entra aqui conforme evoluímos.
 */
