Zing Tech Whitelisting Bot
=================

hi, this is a very customisable version of the zing tech bot for whitelisting ur products - heres a setup guide.

1. clone this repo with `git clone https://github.com/iPanda969/whitelistbot`

2. run `npm i` to install the required packages

3. make 3 new files in the main directory of ur bot `.env`, `products.json` and `links.json` (fill in the json files like below)
- `links.json`
```json
{
    "links": {

    },
    "codes": {

    }
}
```

- `products.json`
```json
{
    "products": {

    }
}
```

4. fill in .env with the following code
```env
# TOKEN
TOKEN=""

# CONFIGURATION
EMBEDCOLOR=""
PREFIX=""
MINWHITELIST=""
MINCONFIG=""
LOGSCHANNEL=""
STATUS=""


# SCRIPTS
PRIMARYGUILD=""
STARTSCRIPT="server.js"
PORT="80"

# API ENDPOINTS
ACCLINKENDPOINT=""
FETCHOWNERSHIPENDPOINT=""
LINKCODEENDPOINT=""
WHITELISTKEY=""
```

- Set TOKEN to your Discord Bot Token
- Set EMBEDCOLOR to the color you want your bot's embeds to be
- Set PREFIX to the prefix you want the bot to listen to
- Set MINWHITELIST to the minimum role's ID needed in that discord server to whitelist a person
- Set MINCONFIG to the minimum role's ID needed in that discord server to create/delete products etc.
- Set LOGSCHANNEL to the channel ID of the channel you want license logs to go to
- Set STATUS to the status you want the discord bot to display
- Set PRIMARYGUILD to the Guild ID of the main guild of your Discord Bot
- Set STARTSCRIPT to the name of the script that the bot runs off (DEFAULT `server.js`)
- Set PORT to the HTTP port you wish this bot to run from (DEFAULT `80`)
- For all entries in the API ENDPOINTS section, set them to the API key for each function (can just be a random string for best results)

**API Endpoints**
=================

- **GET** `/ACCLINKENDPOINT/RobloxID` is the endpoint for checking if a roblox user has a discord account linked through the bot, with ACCLINKENDPOINT being the API Key you set in .env and RobloxID being the Roblox ID of the user you wish to check. This returns one of 2 JSON formatted responses, either `{"status":"error","value":"no account linked"}` OR `{"status":"success","value":"account linked","id":TheirDiscordID}`

- **GET** `/LINKCODEENDPOINT/LinkCode/RobloxID` is the endpoint for making account linking codes for !acclink, again with LINKCODEENDPOINT being the API key you set in the .env and RobloxID being the Roblox ID of the user you want to attach this code to, and with extra field LinkCode, being the code you want to set as this user's link code. IT IS RECOMMENDED THAT THIS IS A RANDOM STRING of 6+ LETTERS AND NUMBERS TO PREVENT OVERWRITING OF CODES. This will return one of 2 JSON responses, either `{"status":"madecode","value":"TheCodeYouSpecified"}` OR `{"status":"exists","value":"APreExistingCodeLinkedToThisUser"}`

- **GET** `/FETCHOWNERSHIPENDPOINT/RobloxID` is the endpoint for fetching an array containing all products a given user owns. FETCHOWNERSHIPENDPOINT is the API key you set in the .env and RobloxID being the Roblox ID of the user you want to fetch licenses for. This will return a single JSON responses, that contains the status and the products - that being `{"status":"success","Product1ID":{"product":"Product1ID","owns":"yes"},"Product2ID":{"product":"Product2ID","owns":"yes"}}`. (There wont be exactly 2 products always, this is just an example)

- **GET** `/whitelisted/ProductID/RobloxID` is the endpoint for checking if a given ROBLOX user owns the specified product. This time, ProductID is the ProductID that was specified in the !create command, and RobloxID is the ID of the user who is being checked against this whitelist. For this one, it will respond in 4 ways, seperated into 2 different primary headers. The first primary header for status is "error", which will have a value of either "no account linked" or "product not found", which are pretty self explanatory. The 2nd status header is "success", which will have a boolean value of either true or false, true being that they own the product, false being that they dont.

- **GET** `/whitelist/WHITELISTKEY/giveproduct/RobloxID/ProductID` is the endpoint for whitelisting a user to a product. Again, WHITELISTKEY is the API key you set in the .env, RobloxID is the Roblox ID of the user you wish to whitelist, and ProductID is the Product ID you specified when you ran !create. Most of this stuff is done in the backend so the response isn't much, but you can expect once again either an "error" or "success" status value. "success" only has one returned value which is the success status, whereas "error" will return some details, such as "no account linked" or "product not found", both once again are self explanatory.

**COMMANDS GUIDE**
=================

- `acclink [LinkCode]`
- `account [OptionalUser]`
- `config [ProductID]`
- `create [ProductID] [ProductName]`
- `delete [ProductID]`
- `forcelink [RobloxName] [DiscordUser]`
- `forceunlink [RobloxName/DiscordUser]`
- `give [DiscordUser] [ProductID]`
- `help`
- `products`
- `restart`
- `revoke [DiscordUser] [ProductID]`
- `unlink`

**BASIC ROBLOX WHITELIST CHECKER**
=================

```lua
local http = game:GetService("HttpService")
local productId = ""

function HttpEnabled()
    local s = pcall(function()
        game:GetService('HttpService'):GetAsync('http://www.google.com/')
    end)
    return s
end

warn("["..string.upper(productId).."] Loading...")

local h = HttpEnabled()
warn("["..string.upper(productId).."] Verifying HTTP...")
if h == false then
	warn("["..string.upper(productId).."] HTTP Disabled! Unloading...")
    script.Parent:Destroy()
end

warn("["..string.upper(productId).."] Checking Licenses...")

local PlaceId = game.PlaceId
local PlaceInfo = game:GetService("MarketplaceService"):GetProductInfo(PlaceId)
local gameOwner = nil
if game.CreatorType == Enum.CreatorType.Group then
    gameOwner = game:GetService("GroupService"):GetGroupInfoAsync(PlaceInfo.Creator.CreatorTargetId).Owner.Id
else
    gameOwner = game.CreatorId
end

local aa = http:GetAsync("http://youru.rl/whitelist/"..productId.."/"..gameOwner)
local a = http:JSONDecode(aa)
if a.value ~= true then
	warn("["..string.upper(productId).."] Owner does not own "..string.upper(productId).."! Unloading...")
	script.Parent:Destroy()
end
```


**CREDITS**
=================

- [Discord.JS Guide](https://discordjs.guide) (helped me with doing modules stuff thx)

**FINALLY**
=================

this code took me a while to entirely modify from being proprietary to being so heavily editable (as well as making the original code itself lol), so i'd appreciate some form of credit for this code/bot, so please *please* dont remove the credits in the botinfo command, thanks <3

also - i dont appreciate people who claim my work as their own, so please dont attempt to resell this. this is open source and free for a reason!

ALSO ALSO (finally) - if you find any bugs in my code, (or wish to improve it in any way *COUGH* im lazy so alot of this is very basic) please tell me so i can fix them the best i can!

yes i know some of this code may not be the most efficient or the best but IT WORKS ok