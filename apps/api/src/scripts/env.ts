async function generateDotenvFile() {
	const dotenv = Bun.file(".env");
	const example = Bun.file(".env.example");

	// Check if a .env file exists
	const exists = await dotenv.exists();

	if (exists) {
		// Then we don't want to override values, terminate script.
		console.error(".env file already exists.");
		process.exit(1);
	}

	const exampleText = await example.text();

	await dotenv.write(exampleText);

	console.log("Filled .env with keys from .env.example");
}

await generateDotenvFile();
