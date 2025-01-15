import { Client } from "@gradio/client";
import { performance } from "perf_hooks";
import readlineSync from "readline-sync";
import colors from "./colors.js";
import spinner from "./spinner.js"

async function prompt(query) {
  const start = performance.now();
  spinner.start();

  const client = await Client.connect("mikeymon/mistral2");
  const result = await client.predict("/chat", { 		
      message: query, 
  });

  const total = (performance.now() - start) / 1000;
  spinner.stop();
  console.log(`[ ${total.toFixed(2)} ${colors.green('sec')} ]\n`)
  console.log(result.data[0]);

  await client.close();
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const query = args.join(' ');
    console.log(`> ${query}`);
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
