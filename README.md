# Brainfuck Interpreter
An interpreter for the esoteric language [Brainfuck](https://wikipedia.org/wiki/Brainfuck) made in Typescript.

It has the capability replace the classic Brainfuck characters with any other characters, such as the [Hand Challenge](https://github.com/jesus-seijas-sp-challenge).

## Usage
```bash
$ npm install
```

It doesn't have a CLI yet, so you have to add the BF code in the `index.ts` file and run it with:
```bash
$ npm run start
```

You could also use the [./tests/testSuite.json](./tests/testSuite.json) file to test the interpreter with the following command:
```bash
$ npm run test
```
