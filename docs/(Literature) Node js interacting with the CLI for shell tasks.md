created: 2026-07-03 

Instead of spawning a new terminal for nod to interact with the system as built in commands that use `node:fs/promises`

- **fs** bypasses completely passing string to the terminal as raw text and rather uses the API to interact directly with the system without spawinng a system shell
- Using `exec`  pass raw string but also it will fail in cross systme like windows sinc the command dont exist directly
- r `spawn` is safert it execute binary directly talkin gto the operating system bypassing teh esystem shell, you use an array of argiments directly in the process memory

## When to use each
- Spawn for command line operations without creating a shell handling system cli responses and storing chunks of data output form the terminal. Streams massive data
- use `fs` for anything at the OS level related to the hard drive

## Imports

### spawn
``` js
import { spawn } from 'node:child_process';
```

## fs
``` js
import { rm, symlink } from 'node:fs/promises';
```

#### readdir
#### readlink
helps you find the symlink of a folder ``

#### move a folder or rename it
`fs.rename()`


---
#### readdir
you can filter the array it return for the files with symbolyc link type `file.isSymbolicLink()`

## Spawn
How to use the spawn array of arguments to interact with the system 

use to send the commands and assign to a variable use the system pipes to interact the incoming data

- **`stdin` (Standard Input):** The pipe used to push data _into_ the program.
    
- **`stdout` (Standard Output):** The pipe the program uses to push normal text _out_.
    
- **`stderr` (Standard Error):** The pipe the program uses to push crash reports or error messages _out_.

in spawn to access to the data obtained in the cli you use .stdout


## I/O operations
To read the input of the terminal from spawn the most rocomended way is to use the readline object wich organizes the data by line breaks and not by buffer failing methods like `includes` 

```js
const git = spawn('git', ['log']);
const scanner = readline.createInterface({ input: git.stdout });

// You receive perfect, complete string lines
for await (const line of scanner) {
    // SAFE: line is guaranteed to be a complete sentence
    console.log(line); 
}
```

### Interacting with the CLI user
For this the readline interface has a built in method called `question` which ask to the user and returns its answer.

```js
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function requireConfirmation() {
    // 1. Create the interface wired to the human's terminal
    const rl = readline.createInterface({ input, output });

    // 2. Pause the script and wait for the human to type something and hit Enter
    const answer = await rl.question('Are you sure you want to create a new worktree? (y/n): ');

    // 3. Evaluate the answer
    if (answer.toLowerCase() === 'y') {
        console.log('Proceeding with system execution...');
        // Execute your logic here
    } else {
        console.log('Operation safely aborted.');
    }

    // 4. You MUST close the interface, otherwise your terminal will hang forever
    rl.close();
}

requireConfirmation();
```

---
## Reference

#AIGeneratedKnowledge 