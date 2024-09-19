// Project Auto Ai & Downloader Mediafire & Tiktok Downloader By Ore Digital
require('./settings.js');
const fs = require('fs');
const util = require('util');
const axios = require('axios');
const chalk = require('chalk');
const fetch = require('node-fetch');

//============>> MODULE
module.exports = client = async (client, m, chatUpdate, store) => {
    try {
        const body = (m.mtype === 'conversation') ? m.message.conversation :
            (m.mtype == 'imageMessage') ? m.message.imageMessage.caption :
                (m.mtype == 'videoMessage') ? m.message.videoMessage.caption :
                    (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text :
                        (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
                            (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                                (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
                                    (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '';

        const sender = m.key.participant || m.key.remoteJid;
        const budy = (typeof m.text == 'string' ? m.text : '');
        const { fromMe } = m;
        const command = body.startsWith('.') ? body.slice(1).split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);

        // Cek apakah pesan dari bot sendiri, jika ya, abaikan
        if (fromMe) return;

        //===============>> SWITCH CASE HANDLING
        switch (command) {
            case 'm':
                if (args.length === 0) {
                    return m.reply('Silakan masukkan link Mediafire yang valid.');
                }
                const mediafireLink = args[0];
                if (mediafireLink.includes('mediafire.com')) {
                    const response = await axios.get(`https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(mediafireLink)}`);
                    if (response.data.status === 200) {
                        const file = response.data.data[0];
                        await client.sendMessage(m.key.remoteJid, { document: { url: file.link }, mimetype: file.mime, fileName: file.nama });
                    } else {
                        m.reply('Maaf, terjadi kesalahan dalam mengambil file Mediafire.');
                    }
                } else {
                    m.reply('Silakan masukkan link Mediafire yang valid.');
                }
                break;

            case 't':
                if (args.length === 0) {
                    return m.reply('Silakan masukkan link TikTok yang valid.');
                }
                const tiktokLink = args[0];
                if (tiktokLink.includes('tiktok.com')) {
                    const response = await axios.get(`https://api.agatz.xyz/api/tiktok?url=${encodeURIComponent(tiktokLink)}`);
                    if (response.data.status === 200 && response.data.data.status) {
                        const videoUrl = response.data.data.data[1].url;  // Video tanpa watermark
                        const audioUrl = response.data.data.music_info.url; // Link audio
                        const videoBuffer = await fetch(videoUrl).then(res => res.buffer());
                        const audioBuffer = await fetch(audioUrl).then(res => res.buffer());

                        // Kirim video dan audio
                        await client.sendMessage(m.key.remoteJid, { video: videoBuffer, caption: `Judul: ${response.data.data.title}\nDurasi: ${response.data.data.duration}` });
                        await client.sendMessage(m.key.remoteJid, { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: true }); // Mengirim sebagai PTT (Push-to-Talk)
                    } else {
                        m.reply('Maaf, link TikTok tidak valid.');
                    }
                } else {
                    m.reply('Silakan masukkan link TikTok yang valid.');
                }
                break;

            default:
                // Auto AI (respon tanpa command .ai)
                if (budy.length > 0) {
                    const response = await axios.get(`https://api.agatz.xyz/api/gptlogic?logic=Generate humanized chatgpt text in Indonesian, you are an AI assistant named ${global.namabot}&p=${encodeURIComponent(budy)}`);
                    if (response.data.status === 200) {
                        m.reply(response.data.data);
                    } else {
                        m.reply('Maaf, terjadi kesalahan dalam menghubungi AI.');
                    }
                }
                break;
        }

    } catch (err) {
        console.log(util.format(err));
        let e = String(err);
        client.sendMessage(`${owner}@s.whatsapp.net`, { text: "err:" + util.format(e), contextInfo: { forwardingScore: 5, isForwarded: true } });
    }
};

// File Watcher
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});