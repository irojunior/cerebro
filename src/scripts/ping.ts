import { clickup } from "../clickup/client.js";

/**
 * Testa a conexão com o ClickUp: lista os workspaces acessíveis pelo token.
 * Rode com: npm run clickup:ping
 */
async function main() {
  console.log("🔌 Testando conexão com o ClickUp...\n");
  const { teams } = await clickup.getTeams();

  if (!teams?.length) {
    console.log("⚠️  Conectou, mas o token não tem acesso a nenhum workspace.");
    return;
  }

  console.log(`✅ Conectado! ${teams.length} workspace(s) encontrado(s):\n`);
  for (const team of teams) {
    console.log(`  • ${team.name}  (id: ${team.id}, ${team.members?.length ?? "?"} membros)`);
  }
  console.log(
    `\n💡 Defina CLICKUP_TEAM_ID=${teams[0].id} no .env para usar "${teams[0].name}" como padrão.`,
  );
}

main().catch((err) => {
  console.error("❌ Falha na conexão:");
  console.error(err.message);
  process.exit(1);
});
