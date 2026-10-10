const fs = require('fs');
const path = require('path');

function getAgentPrompt(agentName) {
  const agentsDir = path.join(__dirname, '../.claude/agents');
  if (!fs.existsSync(agentsDir)) return null;
  
  const files = fs.readdirSync(agentsDir);
  const matched = files.find(f => f.toLowerCase().includes(agentName.toLowerCase()));
  
  if (matched) {
    return fs.readFileSync(path.join(agentsDir, matched), 'utf-8');
  }
  return null;
}

console.log("Claude Agent Runner hazır vəziyyətdədir.");
module.exports = { getAgentPrompt };
