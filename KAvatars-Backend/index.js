/*
Extension Index
 - A report link
 - A way to upload avatars
 - A way to remove avatars
 - Block bad users from having custom avatars
 
Index
 - Tutorial on how to use
Report
 - Provide a username prompt
Verify
 - Do NOT allow for workarounds
Upload
 - Store as base64?
Get
 - Supply all avatars


res.status(000).send("___");
*/
const fetch = require('node-fetch');
const fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const { Webhook } = require('discord-webhook-node');
const hook = new Webhook(process.env["webhook"]);
const express = require("express");
let kavatars = require('./kavatars.json');
const Busboy = require("busboy");
const path = require('path')
async function update() {
	fs.writeFileSync("./kavatars.json", JSON.stringify(kavatars));
}
async function notify(cont) {
	fetch(process.env["webhook"], {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(cont)
	});
}
let app = new express();
app.use(express.static(path.join(__dirname + '/users')));
app.listen(80, () => {
	console.log("KAvatars online");
});
app.get("/", async (req, res) => {
	res.send("Index");
});
app.get("/report", async (req, res) => {
	res.send("Report");
});
app.get("/verify", async (req, res) => {
	res.send("Verify");
});
app.post('/upload', upload.single('avatar'), async function(req, res) {
	await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile?lang=en&_=230308-1043-8d36abd655cc_1678302919628", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-ka-fkey": "MyGodIsNotDead",
		"cookie":"KAAS="+req.body.kaas
  },
  "referrer": "https://www.khanacademy.org/profile/me/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"operationName\":\"getFullUserProfile\",\"variables\":{},\"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    birthMonthYear\\n    lastLoginCountry\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n  isAIGuideEnabled\\n  hasAccessToAIGuideDev\\n}\\n\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
}).then(d => d.json()).then(async d => {
		d = d.data;
		if (d.user !== null) {
			d = d.user;
			await fs.renameSync("./uploads/" + req.file.filename, "./users/" + d.kaid + ".png");
			if (d.username) {
				fs.copyFileSync("./users/" + d.kaid + ".png", "./users/" + d.username + ".png");
				kavatars.users.push(d.username);
			}
			res.send(`{"okay":true}`);
			kavatars.users.push(d.kaid);
			hook.sendFile("./users/" + d.kaid + ".png");
			update();
		}
		else {
			fs.unlinkSync("./uploads/" + req.file.filename);
			res.status(409).send(`{"okay":false}`);
		}
	});
});
var cors = require('cors');
app.use(cors({ origin: '*', credentials: true }));
app.get("/get", async (req, res) => {
	res.sendFile("./kavatars.json", { root: __dirname });
});
app.get('/delete', async (req, res) => {
	await fetch("https://www.khanacademy.org/api/internal/graphql/getFullUserProfile", {
		"headers": {
			"accept": "*/*",
			"accept-language": "en-US,en;q=0.9",
			"content-type": "application/json",
			"sec-ch-ua": "\"Microsoft Edge\";v=\"105\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"105\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Windows\"",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "same-origin",
			"x-ka-fkey": "MyGodIsNotDead",
			"cookie": `fkey=MyGodIsNotDead;KAAS=${req.query.kaas};`
		},
		"referrer": "https://www.khanacademy.org/profile/me/courses",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": "{\"operationName\":\"getFullUserProfile\",\"query\":\"query getFullUserProfile($kaid: String, $username: String) {\\n  user(kaid: $kaid, username: $username) {\\n    id\\n    kaid\\n    key\\n    userId\\n    email\\n    username\\n    profileRoot\\n    gaUserId\\n    qualarooId\\n    isPhantom\\n    isDeveloper: hasPermission(name: \\\"can_do_what_only_admins_can_do\\\")\\n    isCurator: hasPermission(name: \\\"can_curate_tags\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isCreator: hasPermission(name: \\\"has_creator_role\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isPublisher: hasPermission(name: \\\"can_publish\\\", scope: ANY_ON_CURRENT_LOCALE)\\n    isModerator: hasPermission(name: \\\"can_moderate_users\\\", scope: GLOBAL)\\n    isParent\\n    isSatStudent\\n    isTeacher\\n    isDataCollectible\\n    isChild\\n    isOrphan\\n    isCoachingLoggedInUser\\n    canModifyCoaches\\n    nickname\\n    hideVisual\\n    joined\\n    points\\n    countVideosCompleted\\n    bio\\n    profile {\\n      accessLevel\\n      __typename\\n    }\\n    soundOn\\n    muteVideos\\n    showCaptions\\n    prefersReducedMotion\\n    noColorInVideos\\n    autocontinueOn\\n    newNotificationCount\\n    canHellban: hasPermission(name: \\\"can_ban_users\\\", scope: GLOBAL)\\n    canMessageUsers: hasPermission(name: \\\"can_send_moderator_messages\\\", scope: GLOBAL)\\n    isSelf: isActor\\n    hasStudents: hasCoachees\\n    hasClasses\\n    hasChildren\\n    hasCoach\\n    badgeCounts\\n    homepageUrl\\n    isMidsignupPhantom\\n    includesDistrictOwnedData\\n    canAccessDistrictsHomepage\\n    preferredKaLocale {\\n      id\\n      kaLocale\\n      status\\n      __typename\\n    }\\n    underAgeGate {\\n      parentEmail\\n      daysUntilCutoff\\n      approvalGivenAt\\n      __typename\\n    }\\n    authEmails\\n    signupDataIfUnverified {\\n      email\\n      emailBounced\\n      __typename\\n    }\\n    pendingEmailVerifications {\\n      email\\n      __typename\\n    }\\n    tosAccepted\\n    shouldShowAgeCheck\\n    __typename\\n  }\\n  actorIsImpersonatingUser\\n}\\n\",\"variables\":{}}",
		"method": "POST"
	}).then(d => d.json()).then(async d => {
		if (d.data.user) {
			d = d.data;
			fs.unlinkSync("./users/" + d.user.kaid + ".png");
			if (d.user.username) {
				fs.unlinkSync("./users/" + d.user.username + ".png");
			}
			for (var i = kavatars.users.length - 1; i > -1; i--) {
				if (kavatars.users[i] === d.user.kaid || kavatars.users[i] === d.user.username) {
					kavatars.users.splice(i, 1);
				}
			}
			update();
			res.send("{'okay':true}");
		}
		else {
			res.status(409).send("{'okay':false}");
		}
	});
});
app.get('*', function(req, res) {
	res.redirect('/');
});
