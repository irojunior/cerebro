import { clickup } from "../clickup/client.js";
import { config } from "../config.js";

/**
 * Mapeia toda a estrutura do workspace: spaces → folders → lists.
 * Útil para descobrir IDs antes de criar tarefas ou montar o sync.
 * Rode com: npm run clickup:bootstrap
 */
async function main() {
  const { teams } = await clickup.getTeams();
  const team = config.clickup.teamId
    ? teams.find((t: any) => t.id === config.clickup.teamId)
    : teams[0];

  if (!team) {
    throw new Error("Nenhum workspace acessível pelo token.");
  }

  console.log(`🧠 Mapeando workspace: ${team.name} (${team.id})\n`);

  const { spaces } = await clickup.getSpaces(team.id);
  for (const space of spaces) {
    console.log(`📦 Space: ${space.name} (${space.id})`);

    const { folders } = await clickup.getFolders(space.id);
    for (const folder of folders) {
      console.log(`  📁 Folder: ${folder.name} (${folder.id})`);
      const { lists } = await clickup.getFolderLists(folder.id);
      for (const list of lists) {
        console.log(`    📋 List: ${list.name} (${list.id})`);
      }
    }

    const { lists } = await clickup.getFolderlessLists(space.id);
    for (const list of lists) {
      console.log(`  📋 List (sem pasta): ${list.name} (${list.id})`);
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("❌ Erro no bootstrap:", err.message);
  process.exit(1);
});
