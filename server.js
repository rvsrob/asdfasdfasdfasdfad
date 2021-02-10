const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const moment = require('moment')
require('moment-duration-format')
const commands = client.commands = new Discord.Collection();
const aliases = client.aliases = new Discord.Collection();

fs.readdirSync('./commands', { encoding: 'utf8' }).filter(file => file.endsWith(".js")).forEach((files) => {
    let command = require(`./commands/${files}`);
    if (!command.name) return console.log(`Hatalı Kod Dosyası => [/commands/${files}]`)
    commands.set(command.name, command);
    if (!command.aliases || command.aliases.length < 1) return
    command.aliases.forEach((otherUses) => { aliases.set(otherUses, command.name); })
})



//  WATCHING  : !ping izliyor
//  LISTENING : !ping dinliyor
//  PLAYING   : !ping oynuyor 
//  STREAMING : !ping yayında
////----------------------- READY KISMI -----------------------\\\\
client.on('ready', () => {
    client.user.setPresence({ activity: { name: '🎄Developed by Niwren🎄' }, status: 'idle' })
    client.channels.cache.get('801113877169438733').join() // ses kanalı İD
    console.log(`Bot ${client.user.tag} Adı İle Giriş Yaptı!`);
  })
////----------------------- CONFIG KISMI -----------------------\\\\
client.config = {
    vipRoles: ['801111633421795368'], //vip
    unregisteres: ['801110926471462934'], // kayıtsız
    maleRoles: ['801110652357050370'], // erkek
    girlroles: ['801110874969866261'], // bayan
    mods: ["801110603107663875"], // yetkili
    channelID: '801134970806206524', // kayıt kanalı
    yönetim: ['801111869615112212'] // üst yönetim
}
////----------------------- PREFİX KISMI -----------------------\\\\
client.on('message', message => {
    const prefix = ".";// prefix
    if (!message.guild || message.author.bot || !message.content.startsWith(prefix)) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
    if (!cmd) return;
    cmd.run(client, message, args)
})
////----------------------- HEM ETİKET HEMDE TAG ROL KISMI -----------------------\\\\
client.on("userUpdate", async function(oldUser, newUser) { // kod codaredan alınıp editlenmiştir!
    const guildID = "798308652753879070"//sunucu
    const roleID = "801111140867768321"//taglırolü
    const tag = "W"//tag
    const chat = '801134970806206524'// chat
    const log2 = '801134970806206524' // log kanalı
  
    const guild = client.guilds.cache.get(guildID)
    const role = guild.roles.cache.find(roleInfo => roleInfo.id === roleID)
    const member = guild.members.cache.get(newUser.id)
    const embed = new Discord.MessageEmbed().setAuthor(member.displayName, member.user.avatarURL({ dynamic: true })).setColor('#ff0000').setTimestamp().setFooter('🎄Developed by Niwren🎄');
    if (newUser.username !== oldUser.username) {
        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(` ${newUser} isminden \`Rade\` çıakrtarak ailemizden ayrıldı!`))
        } else if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(roleID)
            client.channels.cache.get(chat).send(`<a:gloria_totoyladanss:793106413223149588>Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(${tag})`)
            client.channels.cache.get(log2).send(embed.setDescription(`  ${newUser} ismine \`Rade\` alarak ailemize katıldı`))
        }
    }
   if (newUser.discriminator !== oldUser.discriminator) {
        if (oldUser.discriminator == "0099" && newUser.discriminator !== "0099") {
            member.roles.remove(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketinden \`0099\` çıakrtarak ailemizden ayrıldı!`))
        } else if (oldUser.discriminator !== "0099" && newUser.discriminator == "0099") {
            member.roles.add(roleID)
            client.channels.cache.get(log2).send(embed.setDescription(`  <@!' + newUser + '> etiketine \`0099\` alarak ailemize katıldı`))
            client.channels.cache.get(chat).send(`<a:99_utandm:793369971102580767>Tebrikler, ${newUser} tag alarak ailemize katıldı ona sıcak bir **'Merhaba!'** diyin.(#0099)`)
        }
    }
  
  })

////----------------------- HOŞGELDİN MESAJI KISMI -----------------------\\\\
client.on('guildMemberAdd', (member) => {

    const mapping = {
        " ": "",
        "0": "", // sayı iDleri
        "1": "",
        "2": "",
        "3": "",
        "4": "",
        "5": "",
        "6": "",
        "7": "",
        "8": "",
        "9": "",
    };
    var toplamüye = member.guild.memberCount
    var emotoplamüye = `${toplamüye}`.split("").map(c => mapping[c] || c).join("")
    let memberDay = (Date.now() - member.user.createdTimestamp);
    let createAt = moment.duration(memberDay).format("Y [Yıl], M [ay], W [hafta], DD [gün]")
    let createAt2 = moment.duration(memberDay).format("DD [gün], HH [saat], mm [dakika]")
    if (memberDay > 604800000) {
        client.channels.cache.get(client.config.channelID).send(` **Suncumuza hoşgeldin** ${member} - \`${member.id}\`

• <#801137554522112001> Kanalını okuduktan sonra Register odalarına girip teyit vermelisin!

•  \`ω\` Tagımızı alarak  <@&801111140867768321> rolüne sahip olabilirsin! 

• Seninle birlikte **${emotoplamüye}** üyeye ulaştık

• Hesabın **${createAt}** önce açılmış

<@&801110603107663875>`)
    } else {
        client.channels.cache.get(registerChannel).send(
            new Discord.MessageEmbed()
            .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true }))
            .setDescription(`${member}, Adlı Kullanıcı Sunucuya Katıldı Hesabı **${createAt2}** Önce Açıldığı İçin Şüpheli!`)
            .setTimestamp()
            .setThumbnail(member.user.avatarURL({ dynamic: true }))
            .setFooter(`🎄Developed by Niwren🎄`))
    }
})

////----------------------- TAG MESAJ KISMI -----------------------\\\\
client.on('message', msg => {
    if (msg.content === '!tag') {
        msg.channel.send(`ω`); // tagı yazınız
    } else if (msg.content === 'tag') {
        msg.channel.send(`ω`);// tagı yazınız
    } else if (msg.content === '.tag') {
        msg.channel.send(`ω`);// tagı yazınız
    } else if (msg.content === ".rol-ver") {
        msg.guild.members.cache.forEach(x => {
            x.roles.add("W")
        })
    }
});


////----------------------- TAG TARAMASI KISMI -----------------------\\\\
setInterval(() => {
    const server = client.guilds.cache.get("798308652753879070"); //Server ID 
    server.members.cache.forEach(async member => {
        if (member.roles.cache.has("801111633421795368") || member.roles.cache.has("801115865550159903")) return; //VİP&BOOSTER ROL İD

/*   Yasaklı Tag    */
   if(member.user.username.includes("tasaklıTAG")){
        member.roles.set(["Yasaklı Tag Rol ID"]).catch(() => {}) 
    }


 if (member.user.username.includes("tagı")) {
            await member.roles.add("taglı rolü").catch(() => {})
        }
        if (!member.user.username.includes("tag")) {
            await member.roles.set("kayıtsız rolü")
        }
    })
}, 60 * 1000)// 60(60 saniye) kısmını değiştirebilirsiniz

client.login('NzQ5NjI0NTU3ODUzNDc0ODY2.X0usRQ.qsHaob0TlCm5jxxzN4IDv8vxMbY')//token