     const chalk = require("chalk")
     const fs = require("fs")

     global.owner = ['62xx']
     global.namabot = 'AUTO AI'

     let file = require.resolve(__filename)
     fs.watchFile(file, () => {
	 fs.unwatchFile(file)
	 console.log(chalk.redBright(`Update'${__filename}'`))
   	 delete require.cache[file]
	 require(file)
     })