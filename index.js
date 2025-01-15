import { Client } from "@gradio/client";
import { performance } from "perf_hooks";
import readlineSync from "readline-sync";
import spinner from "../spinner.js"
import colors from "../colors.js"

const HUGGING_FACE_MODEL = "mikeymon/mistral2";
let prior = "";

async function prompt(query) {
  const start = performance.now();
  spinner.start();

  const client = await Client.connect(HUGGING_FACE_MODEL);
  const result = await client.predict("/chat", { 		
      message: prior + "\n" + `User: ${query}`, 
  });
  prior = `User: ${query}\n Assistant: ${result.data[0]}`;

  const total = (performance.now() - start) / 1000;
  spinner.stop();
  console.log(`[ ${colors.cyan(HUGGING_FACE_MODEL)} ] [ ${total.toFixed(2)} sec ]\n`)
  console.log(`${result.data[0]}\n`);

  await client.close();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const query = args.join(' ');
    await prompt(query);
    process.exit(0);
  } else {
    while (true) {
      let query = readlineSync.question('> ');
      if (query.toLowerCase() === 'quit') process.exit(1)
      await prompt(query);
    }
  }
 
}

main()
