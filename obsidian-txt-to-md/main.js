// Import the required Obsidian module
const { Plugin, Notice } = require("obsidian");

class ObsidianTxtToMdPlugin extends Plugin {
    async onload() {
        console.log("Loading Obsidian Txt to MD Plugin...");

        // Add a ribbon icon in the sidebar
        this.addRibbonIcon("file-plus", "Convert .txt to .md", async () => {
            await this.convertTxtToMd();
        });

        // Add a command in the command palette
        this.addCommand({
            id: "convert-txt-md",
            name: "Convert all .txt files to .md",
            callback: async () => {
                await this.convertTxtToMd();
            },
        });

        new Notice("Obsidian Txt to MD Plugin Loaded");
    }

    async convertTxtToMd() {
        const vault = this.app.vault;
        const files = vault.getFiles().filter(file => file.extension === "txt");

        if (files.length === 0) {
            new Notice("No .txt files found in vault.");
            return;
        }

        const backupFolder = "txt_backup";
        await vault.createFolder(backupFolder).catch(() => {}); // Creates the folder if it doesn't exist

        for (let file of files) {
            let content = await vault.read(file);
            let newMdPath = file.path.replace(/\.txt$/, ".md");
            let backupPath = `${backupFolder}/${file.name}`;

            await vault.create(newMdPath, content).catch(() => {});
            await vault.rename(file, backupPath);
        }

        new Notice(`Converted ${files.length} .txt files to .md and moved originals to /${backupFolder}`);
    }

    onunload() {
        console.log("Unloading Obsidian Txt to MD Plugin...");
    }
}

module.exports = ObsidianTxtToMdPlugin;

