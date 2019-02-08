const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const ms = require("ms");
const superagent = require("superagent");
const moment = require("moment");




client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
    client.user.setActivity("http://arisonarp.pl | !help !serwer", {type: "WATCHING"});
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity("!help !serwer", {type: "WATCHING"});
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity("!help !serwer", {type: "WATCHING"});
});





client.on("message", async message => {

  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
 
  
  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
	  
  
  
  if(command === "help") {
	  
    let bicon = message.guild.iconURL;
    let botembed = new Discord.RichEmbed()
        .setThumbnail(bicon)
        .addField("**Admin/Mods**", "Komendy dla administratorów")
		.addField("!ban <osoba> <powód>", "banuje osobę z serwera")
		.addField("!kick <osoba> <powód>", "wyrzuca osobę z serwera")
		.addField("!say <tekst>", "echo")
		.addField("!vote <pytanie>", "robi głosowanie")
		.addField("!purge <od 2 do 100>", "usuwa od 2 do 100 wiadomości nie starszych niż 14 dni")
		.addField("tempmute <1s/m/h/d>", "wycisza użytkownika na serwerze na określony czas")
		.addBlankField(true)
		.addField("**Ogólne**", "Komendy dla administratorów")
		.addField("!info", "informacje o użytkowniku")
		.addField("!serverinfo", "informacje o serwerze")
		.addField("!serwer", "informacje o naszym serwerze")
		.addField("!dog", "losowe zdjęcia psa")
		.addField("!cat", "losowe zdjęcia kota")
		.addField("!botinfo", "informacje o BOCie")
		.addField("!kpn", "kamień, papier, nożyce z BOTem")
		.addField("!avatar <osoba>", "pokazuje awatar użytkownika")
		
		
        .setFooter(`Na prośbę : ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL)
        .setColor('RANDOM')
    .setTimestamp();
      message.delete().catch(O_o=>{});

    message.channel.send(botembed);
}
if(command === "info") {
	
	let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    const member = message.guild.member(user);
	
    const embed = new Discord.RichEmbed()
		.setColor('RANDOM')
		.setThumbnail(user.avatarURL)
		.setTitle(`${user.username}#${user.discriminator}`)
		.addField(":paperclip:ID:paperclip::", `${user.id}`,)
        .addField(":anger: Nazwa użytkownika:anger: :", user.username)
		.addField(":question:TAG:question::", `#${user.discriminator}`)
		.addField(":bell: Status:bell: :", `${user.presence.status}`,)
		.addField(":tv: Obecnie gra w:tv: :", `${user.presence.game ? user.presence.game.name : 'Nic'}`,)
		.setFooter(`Na żądanie ${message.author.username}#${message.author.discriminator}`)
	    .setTimestamp();
     message.channel.send({embed});
    }

    if(command === "vote") {
	if(!message.member.hasPermission("MANAGE_MESSAGES"))
   return message.reply("Niestety, nie masz uprawnień do korzystania z tego!");
  message.delete().catch(O_o=>{}); 
  let question = args.slice(0).join(" ");

  if (args.length === 0)
  return message.reply('**Źle!:** `!vote <>`')

  const embed = new Discord.RichEmbed()
  .setTitle("Głosowanie się zaczęło!")
  .setColor("RANDOM")
  .setDescription(`${question}`)
  .setFooter(`Głosowanie rozpoczęte przez: ${message.author.username}`, `${message.author.avatarURL}`)
  .setTimestamp();

  message.channel.send({embed})
  .then(msg => {
    msg.react('👍')
    msg.react('👎')
  })
  .catch(() => console.error('?!?!?! Nie mam pytań.'));

}


if(command === "dog") {
	    let {
        body
    } = await superagent
        .get(`https://random.dog/woof.json`);
    const dogembed = new Discord.RichEmbed()
        .setTitle("PIESEK <3")
        .setColor("RANDOM")
        .setImage(body.url)
    message.channel.send(dogembed);

}


if(command === "cat") { 
    let {
        body
    } = await superagent
        .get(`http://aws.random.cat/meow`);
    const catembed = new Discord.RichEmbed()
        .setTitle('KOTEK <3')
        .setColor("RANDOM")
        .setImage(body.file)
    message.channel.send(catembed);
}
  
  if(command === "say") {
	  if(!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.reply("Niestety, nie masz uprawnień do korzystania z tego!");
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("Niestety, nie masz uprawnień do korzystania z tego!");

    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Proszę, wybierz użytkownika do wyrzucenia");
    if(!member.kickable) 
      return message.reply("Nie mogę wyrzucić tego użytkownika! Czy man on większą rolę ode mnie? Czy mam uprawnienia do wyrzucania użytkowników?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nie podano przyczyny";
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} został wyrzucony przez ${message.author.tag} ponieważ: ${reason}`);

  }
  

  
  
  if(command === "botinfo") {
	  
    let sicon = message.author.displayAvatarURL;
    let serverembed = new Discord.RichEmbed()
	.setAuthor('📡Informacje o bocie📡')
	.addField('🔨Stworzony przez🔨', "Pankodak#6522",)
    .setColor("RANDOM")
    .setThumbnail(sicon)
    .addField(":closed_lock_with_key:Liczba Serwerów Oglądanych Przez Bota:closed_lock_with_key:", message.client.guilds.size, true)
    .addField(":closed_lock_with_key:Liczba Użytkowników Oglądanych Przez Bota :closed_lock_with_key:", message.client.users.size, true)
	.setFooter("ArisonaRP")
    .setTimestamp();
	  return message.channel.send(serverembed);
  }
  
  if(command === "kpn") {
	    
    let Kamień2 = ["Papier! Ja wygrałem!", "Nożyce! Ty wygrałeś!"]
    let Kamień1 = Math.floor(Math.random() * Kamień2.length);
  
    let Papier2 = ["Kamień! Ty wygrałeś!", "Nożyce! Ja wygrałem!"]
    let Papier1 = Math.floor(Math.random() * Papier2.length);
  
    let Nożyce2 = ["Kamień! Ja wygrałem!", "Papier! Ty wygrałeś!"]
    let Nożyce1 = Math.floor(Math.random() * Nożyce2.length);
  
  let Kamień = new Discord.RichEmbed()
  .setAuthor("Kamień, Papier, Nożyce")
  .setColor("RANDOM")
  .addField("Ty wybrałeś", `${args[0]}`)
  .addField("Ja wybrałem", Kamień2[Kamień1])
  
  let Papier = new Discord.RichEmbed()
  .setAuthor("Kamień, Papier, Nożyce")
  .setColor("RANDOM")
  .addField("Ty wybrałeś", `${args[0]}`)
  .addField("Ja wybrałem", Papier2[Papier1])
  
  let Nożyce = new Discord.RichEmbed()
  .setAuthor("Kamień, Papier, Nożyce")
  .setColor("RANDOM")
  .addField("Ty wybrałeś", `${args[0]}`)
  .addField("Ja wybrałem", Nożyce2[Nożyce1])
  
  
  if (message.content === "!kpn kamień") message.channel.send(Kamień)
  if (message.content === "!kpn Kamień") message.channel.send(Kamień)
  if (message.content === "!kpn k") message.channel.send(Kamień)
  
  if (message.content === "!kpn papier") message.channel.send(Papier)
  if (message.content === "!kpn Papier") message.channel.send(Papier)
  if (message.content === "!kpn p") message.channel.send(Papier)
  
  if (message.content === "!kpn nożyce") message.channel.send(Nożyce)
  if (message.content === "!kpn Nożyce") message.channel.send(Nożyce)
  if (message.content === "!kpn n") message.channel.send(Nożyce)
  
  
  if (message.content === "!kpn") message.channel.send("Opcje: ``Kamień``, ``Papier``, ``Nożyce``. *Użycie: !kpn <opcja>*")
  }


	  
  
  if(command === "ban") {
      if(!message.member.hasPermission("BAN_MEMBERS"))
      return message.reply("Niestety, nie masz uprawnień do korzystania z tego!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Proszę, wybierz użytkownika do zablokowania");
    if(!member.bannable) 
      return message.reply("Nie mogę zablokować tego użytkownika! Czy on ma większą rolę ode mnie? Czy mam uprawnienia do blokowania?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Nie podano przyczyny";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} został zablokowany przez ${message.author.tag} ponieważ: ${reason}`);
  }
  
  
  if(command === "purge") {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");

  if(!args[0]) return message.channel.send("Nie masz dostępu do tej komendy");

  message.channel.bulkDelete(args[0]).then(() => {

    message.channel.send(`🔎Wyczyszczono ${args[0]} wiadomości🔎.`).then(msg => msg.delete(5000));
  });
}
    function checkBots(guild) {
    let botCount = 0; // This is value that we will return
    guild.members.forEach(member => { 
      if(member.user.bot) botCount++; 
    });
    return botCount; // Return amount of bots
  }
  //BOTY
 

  
  
  
  
  
  if(command === "serverinfo"){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
	.addField('🔨WŁAŚCICIEL🔨', message.guild.owner,)
	.setAuthor('📡STATYSTYKI SERWERA📡')
    .setColor("RANDOM")
    .setThumbnail(sicon)
    .addField(":anger: NAZWA SERWERA", message.guild.name)
	.addField(':dvd:Liczba kanałów:dvd:', message.guild.channels.size, true)
    .addField(":calendar: DATA UTWORZENIA SERWERA:", message.guild.createdAt, false)
    .addField("📱LICZBA UŻYTKOWNIKÓW📱", message.guild.memberCount)
	.addField('📱LICZBA BOTÓW📱', checkBots(message.guild), true)
	.setFooter("ArisonaRP")
    .setTimestamp();

    return message.channel.send(serverembed);
  }
if(command === "tempmute"){


  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("Administrator")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.find(`name`, "muted");
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

  setTimeout(function(){
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));


}

  
  
  
  
  
   
   
   if(command === "avatar"){
	    if (args.join(" ") == "") {
        message.reply("Wybierz użytkownika, którego awatar ma być wyświetlony Użycie: !avatar <osoba>");
        return;
    } else {
        let user = message.mentions.users.first(); // Mentioned user
        let image = user.displayAvatarURL; // Get image URL
        let embed = new Discord.RichEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`) // Set author
            .setColor("RANDOM")
            .setImage(image)
			.setFooter(`Na prośbę : ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL)
			.setTimestamp();
        message.channel.send(embed);
		    message.delete().catch(O_o=>{}); 
    }
}

});

client.login(process.env.BOT_TOKEN);
