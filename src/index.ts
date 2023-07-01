/*  
	INSTRUCTIONS:
    >  Increment pointer
    <  Decrement pointer
    +  Increment byte at pointer
    -  Decrement byte at pointer
    .  Output the byte
    ,  Accept one byte of input, store value in byte at pointer
    [  Jump to instruction after matching ']' if byte at pointer is 0
    ]  Jump to instruction after matching '[' if byte at pointer is non-0
*/

import readline from "node:readline";

// This instructions could by changed by another characters
// like the emoji hands version
// https://github.com/jesus-seijas-sp/hand-challenge
enum Instructions {
	PointerInc = ">",
	PointerDec = "<",
	ByteInc = "+",
	ByteDec = "-",
	Output = ".",
	Input = ",",
	OpenLoop = "[",
	CloseLoop = "]",
}
type ValidChar = `${Instructions}`;

// Not necessary for this to be an interface
// but you could want to store more information later 🤷‍♀️
interface StackItem {
	index: number;
}

/**
 * An interpreter for the language [Brainfuck](https://wikipedia.org/wiki/Brainfuck).
 */
export class BFInterpreter {
	private instructionPointer: number;
	private instructions: ValidChar[];

	private dataPointer: number;
	private data: number[];

	private loopStack: StackItem[];

	private output: string[];
	private inputHandler: readline.Interface;

	constructor(){
		this.instructions = [];
		this.instructionPointer = 0;

		this.data = [];
		this.dataPointer = 0;

		this.loopStack = [];

		this.output = [];
		this.inputHandler = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}

	private init(program: string){
		this.instructions = program.split("") as ValidChar[];
		this.instructionPointer = 0;

		this.data = [];
		this.dataPointer = 0;

		this.loopStack = [];

		this.output = [];
		
		if(this.inputHandler) this.inputHandler.close();
		this.inputHandler = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}

	public async run(program: string): Promise<string> {
		this.init(program);

		if(this.instructions.length <= 0) throw new SyntaxError("No instructions");

		const openingBrackets = this.instructions.filter(e => e === Instructions.OpenLoop).length;
		const closingBrackets = this.instructions.filter(e => e === Instructions.CloseLoop).length;

		if(openingBrackets !== closingBrackets) throw new SyntaxError("Unbalanced brackets");

		while(this.instructionPointer < this.instructions.length){
			const instruction = this.instructions[this.instructionPointer];

			switch(instruction){
				case Instructions.PointerInc: {
					this.incrementDataPointer();
					break;
				}
				case Instructions.PointerDec:{
					this.decrementDataPointer();
					break;
				}
				case Instructions.ByteInc: {
					this.incrementByte();
					break;
				}
				case Instructions.ByteDec: {
					this.decrementByte();
					break;
				}
				case Instructions.Output: {
					this.outputByte();
					break;
				}
				case Instructions.Input:{
					await this.inputByte();
					break;
				}
				case Instructions.OpenLoop: {
					if(this.data[this.dataPointer] === 0 || this.data[this.dataPointer] === undefined){
						this.jump();
					} else {
						this.loopStack.push({ index: this.instructionPointer });
					}
					break;
				}
				case Instructions.CloseLoop:{
					if(this.data[this.dataPointer] !== 0 && this.data[this.dataPointer] !== undefined){
						this.jump();
					} else {
						this.loopStack.pop();
					}
					break;
				}

				default: throw new Error("Invalid instruction");
			}
			
			this.instructionPointer++;
		}

		this.inputHandler.close();
		return this.output.join("");
	}

	private incrementDataPointer(){
		this.dataPointer++;
	}

	private decrementDataPointer(){
		this.dataPointer--;
	}

	private incrementByte(){
		if(this.data[this.dataPointer] === undefined) this.data[this.dataPointer] = 0;
		this.data[this.dataPointer]++;
	}

	private decrementByte(){
		if(this.data[this.dataPointer] === undefined) this.data[this.dataPointer] = 0;
		this.data[this.dataPointer]--;
	}

	private outputByte(){
		this.output.push(String.fromCharCode(this.data[this.dataPointer]));
	}

	private async inputByte(){
		const input = await this.prompt("Input a byte:\n");
		if(input === null) throw new Error("Input was null");
		this.data[this.dataPointer] = input.charCodeAt(0);
	}

	private jump(){
		const index = this.indexOfMatchingBracket();
		if(!index) throw new Error("Error matching brackets");
		this.instructionPointer = index;
	}

	private indexOfMatchingBracket(): number | undefined {
		const currentInstruction = this.instructions[this.instructionPointer];
		
		if(currentInstruction === Instructions.CloseLoop) {
			return this.loopStack[this.loopStack.length-1]?.index;
		}
		if(currentInstruction === Instructions.OpenLoop) {
			let loopDepth = this.loopStack.length;
			for(let i = this.instructionPointer; i < this.instructions.length; i++){
				if(this.instructions[i] === Instructions.OpenLoop) loopDepth++;
				if(this.instructions[i] === Instructions.CloseLoop) loopDepth--;
				if(this.loopStack.length === loopDepth) return i;
			}
		}

		throw new TypeError("Should not have jumped, fool");
	}

	private async prompt(message: string): Promise<string | null> {
		return new Promise((resolve, _) => {
			this.inputHandler.question(message, answer => {
				resolve(answer);
			});
		});
	}
}