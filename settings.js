     const chalk = require("chalk")
     const fs = require("fs")

     global.owner = ['6285779825392']
     global.namabot = 'FAZ AI'

     let file = require.resolve(__filename)
     fs.watchFile(file, () => {
	 fs.unwatchFile(file)
	 console.log(chalk.redBright(`Update'${__filename}'`))
   	 delete require.cache[file]
	 require(file)
     })
