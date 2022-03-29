#!/usr/bin/env node

import axios from "axios";
import cac from "cac";
import chalk from "chalk";
import clipboardy from "clipboardy";
import isUrl from "is-url";
import loading from "loading-cli";

const cli = cac();

cli
  .command("shorten <link>", "Shorten a link")
  .alias("s")
  .action(async (link: string) => {
    if (link.startsWith("http") === false) {
      link = `http://${link}`;
    }

    if (isUrl(link) === false) {
      console.error(chalk.red("Please provide a valid URL"));
      process.exit(1);
    }
    const load = loading("Shortening link...").start();
    axios
      .post(`https://api.shrtco.de/v2/shorten?url=${link}`)
      .then(({ data }) => {
        load.stop();

        const shortLink = `linkk.now.sh/${data.result.code}`;

        console.log(chalk.green("Shortened! Copied it to clipboard too!"));

        // copy to clipboard
        clipboardy.writeSync(shortLink);

        console.log(chalk.bgGreen.black(` ${shortLink} `));

        console.log(`Other links:
- ${chalk.blue(data.result.short_link)}
- ${chalk.blue(data.result.short_link2)}
- ${chalk.blue(data.result.short_link3)}`);
      });
  });

cli.help();
cli.version("0.0.4");
cli.parse();
