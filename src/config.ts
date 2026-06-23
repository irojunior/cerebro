import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variável de ambiente ausente: ${name}. Copie .env.example para .env e preencha.`,
    );
  }
  return value;
}

export const config = {
  clickup: {
    token: required("CLICKUP_API_TOKEN"),
    teamId: process.env.CLICKUP_TEAM_ID ?? null,
    baseUrl: "https://api.clickup.com/api/v2",
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? null,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
  },
};
