//Load up the bot...
const Discord = require('discord.js');
const bot = new Discord.Client();
const yourID = "174565176492687361"; //Instructions on how to get this: https://redd.it/40zgse
const setupCMD = "!createrole"
let initialMessage = `**İlişkili rolü almak için aşağıdaki mesajlara tepki verin. Rolü kaldırmak isterseniz, reaksiyonunuzu kaldırmanız yeterlidir.**`;
const roles = ["💻24/7💻", "🎨Tasarımcı🎨", "🎮Oyuncu🎮"];
const reactions = ["💻", "🖌", "🎮"];
const botToken = ("NDU5NzY1ODUyNTMxODUxMjY0.DhIEcA.jYQV0P0tOHtrIF-4i4gC962_8mw");
bot.login(botToken);

//If there isn't a reaction for every role, scold the user!
if (roles.length !== reactions.length) throw "Roller listesi ve reaksiyon listesi aynı uzunlukta değil!";

//Function to generate the role messages, based on your settings
function generateMessages(){
    var messages = [];
    messages.push(initialMessage);
    for (let role of roles) messages.push(`Almak için aşağıya basınıs **"${role}"** role!`); //DONT CHANGE THIS
    return messages;
}


bot.on("message", message => {
    if (message.author.id == yourID && message.content.toLowerCase() == setupCMD){
        var toSend = generateMessages();
        let mappedArray = [[toSend[0], false], ...toSend.slice(1).map( (message, idx) => [message, reactions[idx]])];
        for (let mapObj of mappedArray){
            message.channel.send(mapObj[0]).then( sent => {
                if (mapObj[1]){
                  sent.react(mapObj[1]);  
                } 
            });
        }
    }
})


bot.on('raw', event => {
    if (event.t === 'MESSAGE_REACTION_ADD' || event.t == "MESSAGE_REACTION_REMOVE"){
        
        let channel = bot.channels.get(event.d.channel_id);
        let message = channel.fetchMessage(event.d.message_id).then(msg=> {
        let user = msg.guild.members.get(event.d.user_id);
        
        if (msg.author.id == bot.user.id && msg.content != initialMessage){
       
            var re = `\\*\\*"(.+)?(?="\\*\\*)`;
            var role = msg.content.match(re)[1];
        
            if (user.id != bot.user.id){
                var roleObj = msg.guild.roles.find('name', role);
                var memberObj = msg.guild.members.get(user.id);
                
                if (event.t === "MESSAGE_REACTION_ADD"){
                    memberObj.addRole(roleObj)
                } else {
                    memberObj.removeRole(roleObj);
                }
            }
        }
        })
 
    }   
});
