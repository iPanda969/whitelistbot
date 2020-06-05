
// Zing Tech Licensing 2.0
// axivl

const fs = require('fs');
const express = require('express');
const app = express()
const axios = require("axios")
const Discord = require('discord.js');
const editJsonFile = require("edit-json-file");
const dotenv = require("dotenv");
dotenv.config()
const {
  Client,
  MessageEmbed
} = require('discord.js');

let client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}
async function startApp() {
  client.login(process.env.TOKEN)
  const a = Date(Date.now())
  console.log("Zing Tech Licensing System - ONLINE - " + a.toString())
}
startApp();

client.on("ready", () => {
  client.user.setActivity(process.env.STATUS, { type: process.env.STATUSTYPE })
})

client.on('message', async (message) => {
  if (message.channel.type !== "text" && message.channel.type !== "news") { return }
  if (message.guild.id !== process.env.PRIMARYGUILD) { return }
  if (!message.content.startsWith(process.env.PREFIX)) { return }
  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    const errorembed = new Discord.MessageEmbed()
      .setColor(process.env.EMBEDCOLOR)
      .setAuthor("Error Running Command.", "https://cdn.discordapp.com/attachments/539579135786352652/641188940983959555/627171202464743434.png")
      .setDescription("```xl\n" + error + "\n```")
    message.channel.send(errorembed)
  }
});

app.get("/" + process.env.ACCLINKENDPOINT + "/:robloxid", function (req, res) {
  let file = editJsonFile(`./links.json`)
  const person = file.get("links." + req.params.robloxid)
  if (!person) {
    var response = {
      "status": "error",
      "value": "no account linked"
    }
    res.status(200).json(response)
  } else {
    var response = {
      "status": "success",
      "value": "account linked",
      "id": person.discord
    }
    res.status(200).json(response)
  }
})

app.get("/" + process.env.LINKCODEENDPOINT + "/:linkcode/:robloxid", function (req, res) {
  let file = editJsonFile(`./links.json`)
  let code = false
  let a = file.get("codes")
  if (!a[req.params.robloxid]) {
    file.set("codes." + req.params.linkcode + ".robloxid", req.params.robloxid)
    file.set("codes." + req.params.linkcode + ".linkcode", req.params.linkcode)
    file.set("codes." + req.params.robloxid + ".linkcode", req.params.linkcode)
    file.set("codes." + req.params.robloxid + ".robloxid", req.params.robloxid)
    file.save()
    var response = {
      "status": "madecode",
      "value": req.params.linkcode
    }
    res.status(200).json(response)
  } else {
    var response = {
      "status": "exists",
      "value": file.get("codes." + req.params.robloxid + ".linkcode")
    }
    res.status(200).json(response)
  }
})

app.get("/whitelisted/:productid/:robloxid", function (req, res) {
  let file = editJsonFile(`./links.json`)
  let file3 = editJsonFile(`./products.json`)
  const person = file.get("links." + req.params.robloxid)
  if (!person) {
    var response = {
      "status": "error",
      "error": "no account linked"
    }
    res.status(200).json(response)
  } else {
    const product = file3.get("products." + req.params.productid.toString().toLowerCase())
    if (!product) {
      var response = {
        "status": "error",
        "error": "product not found"
      }
      res.status(200).json(response)
    } else {
      if (product.users[person.roblox]) {
        var response = {
          "status": "success",
          "value": true
        }
        res.status(200).json(response)
      } else {
        var response = {
          "status": "success",
          "value": false
        }
        res.status(200).json(response)
      }
    }
  }
})

app.get("/" + process.env.FETCHOWNERSHIPENDPOINT + "/:robloxid",function(req,res){
  let file = editJsonFile(`./products.json`)
  let lol = file.get("products")
  let text = {
    "status" : "good"
  }
  for (var k in lol) {
    if(lol[k].users[req.params.robloxid]) {
      text[lol[k].hubid] = {
        "product" : lol[k].hubid,
        "owns": "yes"
      }
    }
  }
  res.status(200).json(text)
})

app.get("/whitelist/" + process.env.WHITELISTKEY + "/giveproduct/:robloxid/:product", function (req, res) {
  let file = editJsonFile(`./links.json`)
  let file3 = editJsonFile(`./products.json`)
  const person = file.get("links." + req.params.robloxid)
  if (!person) {
    var response = {
      "status": "error",
      "error": "no account linked"
    }
    res.status(200).json(response)
  } else {
    const product = file3.get("products." + req.params.product.toString().toLowerCase())
    if (!product) {
      var response = {
        "status": "error",
        "error": "product not found"
      }
      res.status(200).json(response)
    } else {
      client.guilds.resolve(process.env.PRIMARYGUILD).members.fetch(person.discord).then(userrr => {
        file3.set("products." + req.params.product.toString().toLowerCase() + ".users." + person.roblox + ".status", true)
        file3.set("products." + req.params.product.toString().toLowerCase() + ".users." + person.roblox + ".userid", person.roblox)
        file3.save()
        axios.get("https://users.roblox.com/v1/users/" + person.roblox)
          .then(function (callback2) {
            const finalembed = new Discord.MessageEmbed()
              .setColor(process.env.EMBEDCOLOR)
              .setAuthor("License Granted", client.guilds.resolve(process.env.PRIMARYGUILD).iconURL())
              .addField("User", callback2.data.name + " (" + person.roblox + ")", true)
              .addField("Product", product.name, true)
              .addField("Method", "API - Product Purchase")
              .setThumbnail('https://www.roblox.com/headshot-thumbnail/image?userId=' + person.roblox + '&width=420&height=420&format=png')
            client.guilds.resolve(process.env.PRIMARYGUILD).channels.resolve(process.env.LOGSCHANNEL).send(finalembed)
          })
        const embed = new Discord.MessageEmbed()
          .setColor(process.env.EMBEDCOLOR)
          .setAuthor("Thanks for your Purchase!", client.guilds.resolve(process.env.PRIMARYGUILD).iconURL())
          .setDescription("You have now been granted a license for `" + product.name + "`. We hope you enjoy your purchase!");
        userrr.send(embed)
        var response = {
          "status": "success"
        }
        res.status(200).json(response)
      })
        .catch(err)
    }
  }
})

client.on('error', console.error)
app.listen(process.env.PORT || 8080)
