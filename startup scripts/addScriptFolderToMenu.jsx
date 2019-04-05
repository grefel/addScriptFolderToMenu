//DESCRIPTION:Adds a Menu Scripts to the main InDesign menu and display all scripts of a Folder. 
//Contact: Gregor Fellenz - http://www.publishingx.de
//@targetengine scriptsFolderMenu

var px = {
	projectName: "AddScriptFolderToMenu",
	version: "2019-01-31-v1.1",

	scriptFolderMenuFolderName: "Scripts Menu",
	scriptMenuName: localize({ en: "Scripts", de: "Skripte" }),

	position: "table", // help
	ignoreRegex: /^lib|log|.git|.vscode$/, // if this regex matches, the file or folder is ignored

	// Verwaltung
	appendLog: true,
	debug: false
}

if (app.extractLabel("px:debugID") == "Jp07qcLlW3aDHuCoNpBK_Gregor-") {
	px.debug = true;
}
/****************
* Logging Class 
* @Version: 1.07
* @Date: 2018-10-10
* @Author: Gregor Fellenz, http://www.publishingx.de
* Acknowledgments: Library design pattern from Marc Aturet https://forums.adobe.com/thread/1111415

* Usage: 

log = idsLog.getLogger("~/Desktop/testLog.txt", "INFO");
log.warnAlert("Warn message");

*/
$.global.hasOwnProperty('idsLog') || (function (HOST, SELF) {
	HOST[SELF] = SELF;

	/****************
	* PRIVATE
	*/
	var INNER = {};
	INNER.version = "2018-09-26-1.06";
	INNER.disableAlerts = false;
	INNER.logLevel = 0;
	INNER.SEVERITY = [];
	INNER.SEVERITY["OFF"] = 4;
	INNER.SEVERITY["ERROR"] = 3;
	INNER.SEVERITY["WARN"] = 2;
	INNER.SEVERITY["INFO"] = 1;
	INNER.SEVERITY["DEBUG"] = 0;

	INNER.processMsg = function (msg) {
		if (msg == undefined) {
			msg = ""; // return ?
		}
		if ((msg instanceof Error)) {
			msg = msg + " Line: " + msg.line + " # " + msg.number + " File: " + msg.fileName;
		}
		if (msg.constructor.name != String) {
			msg = msg.toString();
		}
		return msg;
	}

	INNER.writeLog = function (msg, severity, file) {
		var date = new Date();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		var dateString = (date.getYear() + 1900) + "-" + ((month < 10) ? "0" : "") + month + "-" + ((day < 10) ? "0" : "") + day + " " + ((hour < 10) ? "0" : "") + hour + ":" + ((minute < 10) ? "0" : "") + minute + ":" + ((second < 10) ? "0" : "") + second;
		var padString = (severity.length == 4) ? " " : ""
		msg = msg.replace(/\r|\n/g, '<br/>');
		file.encoding = "UTF-8";
		file.open("a");
		if (INNER.logLevel == 0) {
			var stack = $.stack.split("\n");
			stack = stack[stack.length - 4];
			file.writeln(dateString + " [" + severity + "] " + padString + "[" + msg + "] Function: " + stack.substr(0, 100));
		} else {
			file.writeln(dateString + " [" + severity + "] " + padString + "[" + msg + "]");
		}
		file.close();
	};
	INNER.showAlert = function (title, msg, type) {
		if (!INNER.disableAlerts) {
			if (msg.length < 300) {
				alert(msg, title)
			}
			else {
				INNER.showMessages(title, [msg], type);
			}
		}
	};
	INNER.showMessages = function (title, msgArray, type) {
		if (!INNER.disableAlerts && msgArray.length > 0) {
			var callingScriptVersion = "    ";
			if ($.global.hasOwnProperty("px") && $.global.px.hasOwnProperty("projectName")) {
				callingScriptVersion += px.projectName;
			}
			if ($.global.hasOwnProperty("px") && $.global.px.hasOwnProperty("version")) {
				callingScriptVersion += " v" + px.version;
			}
			for (var i = 0; i < msgArray.length; i++) {
				if (msgArray[i] == undefined) {
					msg = ""; // return ?
				}
				if (msgArray[i] instanceof Error) {
					msgArray[i] = msgArray[i] + " -> " + msgArray[i].line
				}
				if (msgArray[i].constructor.name != String) {
					msgArray[i] = msgArray[i].toString();
				}
			}
			var msg = msgArray.join("\n");
			var dialogWin = new Window("dialog", title + callingScriptVersion);
			dialogWin.etMsg = dialogWin.add("edittext", undefined, msg, { multiline: true, scrolling: true });
			dialogWin.etMsg.maximumSize.height = 300;
			dialogWin.etMsg.minimumSize.width = 500;

			dialogWin.gControl = dialogWin.add("group");
			dialogWin.gControl.preferredSize.width = 500;
			dialogWin.gControl.alignChildren = ['right', 'center'];
			dialogWin.gControl.margins = 0;
			dialogWin.gControl.btSave = null;
			dialogWin.gControl.btSave = dialogWin.gControl.add("button", undefined, localize({ en: "Save", de: "Speichern" }) + " " + type);
			dialogWin.gControl.btSave.onClick = function () {
				var texFile = File.saveDialog(localize({ en: "Save information in text file ", de: "Speichern der Informationen in einer Textdatei" }), INNER.getFileFilter(localize({ en: "Textfile ", de: "Textdatei" }) + ":*.txt"));
				if (texFile) {
					if (!texFile.name.match(/\.txt$/)) {
						texFile = File(texFile.fullName + ".txt");
					}
					texFile.encoding = "UTF-8";
					texFile.open("e");
					texFile.writeln(msg);
					texFile.close();
					dialogWin.close();
				}
			}
			dialogWin.gControl.add("button", undefined, "Ok", { name: "ok" });
			dialogWin.show();
		}
	};
	INNER.confirmMessages = function (title, msgArray, type) {
		if (!INNER.disableAlerts && msgArray.length > 0) {
			var callingScriptVersion = "    ";
			if ($.global.hasOwnProperty("px") && $.global.px.hasOwnProperty("projectName")) {
				callingScriptVersion += px.projectName;
			}
			if ($.global.hasOwnProperty("px") && $.global.px.hasOwnProperty("version")) {
				callingScriptVersion += " v" + px.version;
			}
			var msg = msgArray.join("\n");
			var dialogWin = new Window("dialog", title + callingScriptVersion);
			dialogWin.etMsg = dialogWin.add("edittext", undefined, msg, { multiline: true, scrolling: true });
			dialogWin.etMsg.maximumSize.height = 300;
			dialogWin.etMsg.minimumSize.width = 500;

			dialogWin.gControl = dialogWin.add("group");
			dialogWin.gControl.preferredSize.width = 500;
			dialogWin.gControl.alignChildren = ['right', 'center'];
			dialogWin.gControl.margins = 0;
			dialogWin.gControl.btSave = null;
			dialogWin.gControl.btSave = dialogWin.gControl.add("button", undefined, localize({ en: "Save", de: "Speichern" }) + " " + type);
			dialogWin.gControl.btSave.onClick = function () {
				var texFile = File.saveDialog(localize({ en: "Save information in text file ", de: "Speichern der Informationen in einer Textdatei" }), INNER.getFileFilter(".txt", localize({ en: "Textfile ", de: "Textdatei" })));
				if (texFile) {
					if (!texFile.name.match(/\.txt$/)) {
						texFile = File(texFile.fullName + ".txt");
					}
					texFile.encoding = "UTF-8";
					texFile.open("e");
					texFile.writeln(msg);
					texFile.close();
				}
			}
			dialogWin.gControl.add("button", undefined, localize({ en: "Cancel script", de: "Skript Abbrechen" }), { name: "cancel" });
			dialogWin.gControl.add("button", undefined, "Ok", { name: "ok" });
			return dialogWin.show();
		}
	};

	INNER.confirm = function (message, noAsDefault, title) {
		return confirm(message, noAsDefault, title);
	}

	INNER.getFileFilter = function (fileFilter) {
		if (fileFilter == undefined || File.fs == "Windows") {
			return fileFilter;
		}
		else {
			// Mac
			var extArray = fileFilter.split(":")[1].split(";");
			return function fileFilter(file) {
				if (file.constructor.name === "Folder") return true;
				if (file.alias) return true;
				for (var e = 0; e < extArray.length; e++) {
					var ext = extArray[e];
					ext = ext.replace(/\*/g, "");
					if (file.name.slice(ext.length * -1) === ext) return true;
				}
			}
		}
	};

	INNER.msToTime = function (microseconds) {
		var milliseconds = microseconds / 1000;
		var ms = parseInt((milliseconds % 1000) / 100)
		//Get hours from milliseconds
		var hours = milliseconds / (1000 * 60 * 60);
		var absoluteHours = Math.floor(hours);
		var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;

		//Get remainder from hours and convert to minutes
		var minutes = (hours - absoluteHours) * 60;
		var absoluteMinutes = Math.floor(minutes);
		var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

		//Get remainder from minutes and convert to seconds
		var seconds = (minutes - absoluteMinutes) * 60;
		var absoluteSeconds = Math.floor(seconds);
		var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;


		return h + ':' + m + ':' + s + "." + ms;
	};
	/****************
    * API 
    */

    /**
    * Returns a log Object
    * @logFile {File|String} Path to logfile as File Object or String.
    * @logLevel {String} Log Threshold  "OFF", "ERROR", "WARN", "INFO", "DEBUG"
    * @disableAlerts {Boolean} Show alerts
    */
	SELF.getLogger = function (logFile, logLevel, disableAlerts) {
		if (logFile == undefined) {
			throw Error("Cannot instantiate Log without Logfile. Please provide a File");
		}
		$.hiresTimer;
		if (logFile instanceof String) {
			logFile = File(logFile);
		}
		if (!(logFile instanceof File)) {
			throw Error("Cannot instantiate Log. Please provide a File");
		}
		if (logLevel == undefined) {
			logLevel = "INFO";
		}
		if (disableAlerts == undefined) {
			disableAlerts = false;
		}

		INNER.logLevel = INNER.SEVERITY[logLevel];
		INNER.disableAlerts = disableAlerts;

		var counter = {
			debug: 0,
			info: 0,
			warn: 0,
			error: 0
		}
		var messages = {
			info: [],
			warn: [],
			error: []
		}

		return {
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			writeln: function (message) {
				message = INNER.processMsg(message);
				if (typeof px != "undefined" && px.hasOwnProperty("debug") && px.debug) {
					$.writeln(message);
				}
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes a debug log message
			* @message {String} message Message to log.
			*/
			debug: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel == 0) {
					INNER.writeLog(message, "DEBUG", logFile);
					counter.debug++;
				}
			},
			/**
			* Writes an info log message
			* @message {String} message Message to log.
			*/
			info: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile);
					counter.info++;
					messages.info.push(message);
				}
			},
			/**
			* Writes an info log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			infoAlert: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "INFO", logFile);
					counter.info++;
					messages.info.push(message);
					INNER.showAlert("[INFO]", message, localize({ en: "informations", de: " der Informationen" }));
				}
			},
			/**
			* Writes an info message and adds the message to the warn array
				useful to add information to the warning messages without incrementing the warn counter.
				e.g. put information about file name while processing different documents.
			* @message {String} message Message to log.
			*/
			warnInfo: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 1) {
					INNER.writeLog(message, "INFO", logFile);
					counter.info++;
					messages.info.push(message);
				}
				if (INNER.logLevel <= 2) {
					messages.warn.push(message);
				}
			},
			/**
			* Writes a warn log message
			* @message {String} message Message to log.
			*/
			warn: function (message) {
				message = INNER.processMsg(message);
				if (typeof px != "undefined" && px.hasOwnProperty("debug") && px.debug) {
					$.writeln("WARN: \n" + message);
				}
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile);
					counter.warn++;
					messages.warn.push(message);
				}
			},
			/**
			* Writes a warn log message und displays an Alert-Window
			* @message {String} message Message to log.
			*/
			warnAlert: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 2) {
					INNER.writeLog(message, "WARN", logFile);
					counter.warn++;
					messages.warn.push(message);
					INNER.showAlert("[WARN]", message + "\n\nPrüfen Sie auch das Logfile:\n" + logFile, localize({ en: "warnings", de: "der Warnungen" }));
				}
			},
			/**
			* Writes a error log message
			* @message {String} message Message to log.
			*/
			error: function (message) {
				message = INNER.processMsg(message);
				if (INNER.logLevel <= 3) {
					INNER.writeLog(message, "ERROR", logFile);
					counter.error++;
					messages.error.push(message);
				}
			},

			/**
			* Shows all warnings
			*/
			showWarnings: function () {
				INNER.showMessages("Es gab " + counter.warn + " Warnmeldungen", messages.warn, localize({ en: "warnings", de: "der Warnungen" }));
			},
			/**
			* Confirm all warnings
			*/
			confirmWarnings: function () {
				var message = "confirmWarnings: Es gab " + counter.warn + " Warnmeldungen"
				INNER.writeLog(message, "INFO", logFile);

				var res = INNER.confirmMessages(message, messages.warn, localize({ en: "warnings", de: "der Warnungen" }));
				INNER.writeLog("User interaction: " + res, "INFO", logFile);
				return res;
			},

			/* Confirm a warning */
			confirm: function (message, noAsDefault, title) {
				message = INNER.processMsg(message);
				if (title == undefined) {
					title = "";
				}
				INNER.writeLog("log: " + message, "INFO", logFile);
				var res = INNER.confirm(message, noAsDefault, title);
				INNER.writeLog("User interaction: " + res, "INFO", logFile);
				return res;
			},


			/**
			* Returns all warnings
			*/
			getWarnings: function () {
				return messages.warn.join("\n");
			},
			/**
			* Shows all infos
			*/
			showInfos: function () {
				INNER.showMessages("Es gab " + counter.info + " Infos", messages.info, localize({ en: "informations", de: " der Informationen" }));
			},
			/**
			* Returns all infos
			*/
			getInfos: function () {
				return messages.info.join("\n");
			},
			/**
			* Shows all errors
			*/
			showErrors: function () {
				INNER.showMessages("Es gab " + counter.error + " Fehler", messages.error, localize({ en: "errors", de: "der Fehler" }));
			},
			/**
			* Returns all errors
			*/
			getErrors: function () {
				return messages.error.join("\n");
			},
			/**
			* Returns the counter Object
			*/
			getCounters: function () {
				return counter;
			},


			/**
			* Set silent Mode
			* @message {Boolean} true will not show alerts!
			*/
			disableAlerts: function (mode) {
				INNER.disableAlerts = mode;
			},

			/**
			* Clear Logfile and counters
			*/
			clearLog: function () {
				logFile.open("w");
				logFile.write("");
				logFile.close();
				counter.debug = 0;
				counter.info = 0;
				counter.warn = 0;
				counter.error = 0;
				messages.info = [];
				messages.warn = [];
				messages.error = [];
			},
			/**
			* Reset Message and counters - use showWarning before !
			*/
			resetCounterAndMessages: function () {
				counter.debug = 0;
				counter.info = 0;
				counter.warn = 0;
				counter.error = 0;
				messages.info = [];
				messages.warn = [];
				messages.error = [];
			},
			/**
			* Shows the log file in the system editor
			*/
			showLog: function () {
				logFile.execute();
			},
			/**
			* Prints elapsed time since and resets Timer 
			*/
			elapsedTime: function () {
				var message = "Elapsed time: " + INNER.msToTime($.hiresTimer);
				INNER.writeLog(message, "INFO", logFile);
				counter.info++;
				messages.info.push(message);
			},
			/**
			* reset the elapsed Time Timer
			*/
			resetTimer: function () {
				$.hiresTimer;
			},
			/**
			* Returns elapsed time without writing to log or resetting
			*/
			getElapsedTime: function () {
				return INNER.msToTime($.hiresTimer);
			},
			/**
			* Returns the current log Folder path
			*/
			getLogFolder: function () {
				return logFile.parent;
			}
		}
	};
})($.global, { toString: function () { return 'idsLog'; } });

main();

function main() {
	initLog();
	log.info("addScriptFolderToMenu.jsx mit app.scriptPreferences.version " + app.scriptPreferences.version + " app.version " + app.version);

	app.addEventListener('beforeQuit', uninstallMenu);



	uninstallMenu();
	// var fcFolder;
	// var platfrom = File.fs;
	// // User Files 
	// if(platfrom == "Macintosh") {
	// 	fcFolder = File (app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/" +folderType);
	// } else {
	// 	fcFolder = Folder(app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/" + folderType);
	// }	

	// // Program Files 
	// if(platfrom == "Macintosh") {
	// 	fcFolder = File (Folder.appPackage.parent + "/Presets/Find-Change Queries/" +folderType + "/" + $.locale);
	// } else {
	// 	fcFolder = File (Folder.appPackage + "/Presets/Find-Change Queries/" +folderType + "/" + $.locale);
	// }
	installMenu();
}

function installMenu() {
	// User Folder 
	var scriptFolderMenuPath = Folder(app.scriptPreferences.scriptsFolder + "/" + px.scriptFolderMenuFolderName);
	if (scriptFolderMenuPath.alias) {
		try {
			scriptFolderMenuPath = scriptFolderMenuPath.resolve();
		}
		catch (e) {
			log.warn(e);
			log.warn("Could not resolve alias. Check your alias file [" + scriptFolderMenuPath + "]");
			return;
		}
	}

	if (scriptFolderMenuPath.exists) {
		// analyse scripts in scriptfolder 
		var scriptsArray = [];
		scriptsArray = analyseScriptsFolder(scriptFolderMenuPath, scriptsArray);
		if (scriptsArray.length == 0) {
			log.warn("No script files found in folder [" + scriptFolderMenuPath + "]");
			return;
		}

		// log.info(scriptsArray.toSource());

		// Install menu
		if (px.position == "table") {
			var refMenuEntry = app.menus.item("$ID/Main").submenus.item("$ID/Table");
			if (!refMenuEntry.isValid) refMenuEntry = app.menus.item("$ID/Main").submenus.item("Tabelle");
			if (!refMenuEntry.isValid) refMenuEntry = app.menus.item("$ID/Main").submenus[5];
		}
		if (px.position == "help") {
			var refMenuEntry = app.menus.item("$ID/Main").submenus.item("$ID/Window");
			if (!refMenuEntry.isValid) refMenuEntry = app.menus.item("$ID/Main").submenus.item("Fenster");
			if (!refMenuEntry.isValid) refMenuEntry = app.menus.item("$ID/Main").submenus[7];
		}
		if (!refMenuEntry.isValid) {
			refMenuEntry = app.menus.item("$ID/Main").submenus[app.menus.item("$ID/Main").submenus.length - 2];
			log.warn("could not find the  menu entry [Table] put the menu to the next to last position.");
		}
		var menuEntry = app.menus.item("$ID/Main").submenus.add(px.scriptMenuName, LocationOptions.AFTER, refMenuEntry);
		generataMenuEntries(scriptsArray, menuEntry);

		// Add version and uninstall Information
		menuEntry.menuSeparators.add();
		scriptAction = app.scriptMenuActions.add(localize({ en: "About", de: "Über" }) + " " + px.projectName);
		scriptAction.eventListeners.add("onInvoke", showInfoAndUninstall);
		menuEntry.menuItems.add(scriptAction);

	}
	else {
		log.info("Could not find a Folder [" + px.scriptFolderMenuFolderName + "] in [" + app.scriptPreferences.scriptsFolder + "]");
	}
}



function analyseScriptsFolder(folder, scriptsArray) {
	var children = folder.getFiles();
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.alias) {
			log.info("Löse Alias auf");
			var aliasName = child.name;
			child = child.resolve();
			child.aliasName = aliasName;
		}
		if (child.hidden) {
			log.info("Dropped hidden File or Folder [" + child.name + "]");
			continue;
		}
		if (child instanceof Folder) {
			if (child.name.match(px.ignoreRegex)) {
				log.info("Dropped special Folder [" + child.name + "]");
			}
			else if (!checkForChildren(child)) {
				log.info("Dropped empty Folder [" + child.name + "]");
			}
			else {
				log.info("ADD Subfolder [" + child.name + "]");
				scriptsArray.push(
					{
						name: child.aliasName ? child.aliasName : child.displayName,
						folder: analyseScriptsFolder(child, [])
					}
				);
			}
		}
		else if (child.name.match(/\.jsx(bin)?$/) || child.name.match(/^(\d\d_)?separator-*.txt$/)) {
			log.info("ADD Menu Entry [" + child.name + "]");
			scriptsArray.push(
				{
					name: child.displayName,
					file: child
				}
			);
		}
		else {
			// $.bp(child.name.match(/press2id/))
			log.info("Ignore [" + child.name + "]");
		}
	}

	scriptsArray.sort(function (a, b) {
		a = a.name;
		b = b.name;
		var sortRegex = /^(\d\d)_/;
		if (a.match(sortRegex) && b.match(sortRegex)) { // Sort by Number
			aNumber = a.match(sortRegex)[1] * 1;
			bNumber = b.match(sortRegex)[1] * 1;
			return aNumber - bNumber;
		}
		else { // Sort by Name
			var nameA = a.toUpperCase(); // ignore upper and lowercase
			var nameB = b.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			// namen sind gleich 
			return 0;
		}
	})

	return scriptsArray;
}

function checkForChildren(child) {
	var children = child.getFiles();
	for (i  = 0; i < children.length; i++) {
		child = children[i];
		if (child instanceof Folder && checkForChildren(child)) {
			return true;
		}
		if (child.toString().match(/\.jsx(bin)?$/)) {
			return true;
		}
	}
	return false;
}

function generataMenuEntries(scriptsArray, menuEntry) {

	for (var i = 0; i < scriptsArray.length; i++) {
		var entry = scriptsArray[i];
		var menuName = decodeURI(entry.name.replace(/^\d\d_/, "").replace(/\.jsx(bin)?$/, ""));
		if (entry.hasOwnProperty("folder")) {
			// submenu erstellen
			log.info("Generate Submenu " + menuName);
			var subMenu = menuEntry.submenus.add(menuName, LocationOptions.AT_END);
			generataMenuEntries(entry.folder, subMenu);
		}
		else if (entry.hasOwnProperty("file")) {
			if (entry.name.match(/^(\d\d_)?separator-*.txt$/)) {
				log.info("Generate Separator");
				menuEntry.menuSeparators.add();
			}
			else {
				log.info("Generate ScriptAction " + menuName);
				var runcontext = "";
				try {
					entry.file.open("r");
					var firstLine = entry.file.readln();
					if (firstLine.match(/^\/\/SCRIPTMENU:(.+)/)) {
						menuName = firstLine.match(/\/\/SCRIPTMENU:(.+)/)[1];
						log.info("SCRIPTMENU Tag wurde ausgewertet: " + menuName);
					}
					var secondLine = entry.file.readln();
					if (secondLine.match(/^\/\/RUNCONTEXT:(.+)/)) {
						runcontext = secondLine.match(/\/\/RUNCONTEXT:(.+)/)[1];
						runcontext.replace(/\s/g, "");
						log.info("RUNCONTEXT Tag wurde ausgewertet: [" + runcontext + "]");
					}
				} catch (e) {
					entry.file.close();
				}
				var scriptAction = app.scriptMenuActions.add(menuName);
				scriptAction.eventListeners.add("onInvoke", entry.file);
				if (runcontext == "DOCUMENT") {
					scriptAction.eventListeners.add("beforeDisplay", beforeDisplyHanderlActiveDocument);
				}
				menuEntry.menuItems.add(scriptAction);
			}
		}
		else {
			log.warn("Unknown scriptsarray entry [" + entry.toSource() + "]");
		}
	}
}

// Altes Menü entfernen 
function uninstallMenu() {
	var scriptMenuName = px.scriptMenuName;
	// Remove old menu items
	try {
		if (app.menus.item("$ID/Main").submenus.itemByName(scriptMenuName).isValid) {
			app.menus.item("$ID/Main").submenus.itemByName(scriptMenuName).menuElements.everyItem().remove();
			app.menus.item("$ID/Main").submenus.itemByName(scriptMenuName).remove();
			log.info("Menu [" + scriptMenuName + "] uninstalled.");
		}
		else {
			log.info("No menu [" + scriptMenuName + "] for uninstall.");
		}
	}
	catch (e) {
		log.info("Something went wrong during uninstall of menu [" + scriptMenuName + "]\n Error: " + e + "Line: " + e.line);
	}
}

function showInfoAndUninstall() {
	try {
		var dialogWin = new Window("dialog", px.projectName + " v" + px.version);
		dialogWin.alignChildren = "left";

		dialogWin.gText = dialogWin.add("group");

		dialogWin.gText.stMsg = dialogWin.gText.add("statictext", undefined, localize({ en: "This menu shows scripts from " + px.scriptFolderMenuFolderName, de: "Dieses Menü zeigt die Skripte aus dem Ordner " + px.scriptFolderMenuFolderName }));
		dialogWin.gText.stMsg.maximumSize.height = 300;
		dialogWin.gText.stMsg.minimumSize.width = 350;

		dialogWin.gText.btOpenFolderLocation = dialogWin.gText.add("button", undefined, localize({ en: "Show folder", de: "Ordner anzeigen" }));
		dialogWin.gText.btOpenFolderLocation.onClick = function () {
			Folder(app.scriptPreferences.scriptsFolder + "/" + px.scriptFolderMenuFolderName).execute();
			dialogWin.close(0);
		}

		dialogWin.gText2 = dialogWin.add("group");
		dialogWin.gText2.stMsg2 = dialogWin.gText2.add("statictext", undefined, localize({ en: "by Gregor Fellenz", de: "Von Gregor Fellenz" }));
		dialogWin.gText2.goToWebsite = dialogWin.gText2.add("button", undefined, "https://www.publishingX.de");
		dialogWin.gText2.goToWebsite.onClick = function () {
			openURL('https://www.publishingX.de');
		}

		dialogWin.gInfo = dialogWin.add("group");
		// dialogWin.gInfo.preferredSize.width = 330;
		// dialogWin.gInfo.alignChildren = ['right', 'center'];
		// dialogWin.gInfo.margins = 0;

		dialogWin.gInfo.btShowLog = dialogWin.gInfo.add("button", undefined, localize({ en: "Show Log", de: "Log anzeigen" }));
		dialogWin.gInfo.btShowLog.onClick = function () {
			log.showLog();
			dialogWin.close(0);
		}

		dialogWin.gInfo.btOpenLocation = dialogWin.gInfo.add("button", undefined, localize({ en: "Show startup script", de: "Startskriptdatei anzeigen" }));
		dialogWin.gInfo.btOpenLocation.onClick = function () {
			getScriptFolderPath().execute();
			dialogWin.close(0);
		}

		dialogWin.gInfo.btUpdate = dialogWin.gInfo.add("button", undefined, localize({ en: "Update Menu", de: "Menü aktualisieren" }));
		dialogWin.gInfo.btUpdate.onClick = function () {
			dialogWin.close(99);
		}

		dialogWin.gInfo.btUninstall = dialogWin.gInfo.add("button", undefined, localize({ en: "Remove Menu", de: "Menü entfernen" }));
		dialogWin.gInfo.btUninstall.onClick = function () {
			alert(localize({ en: "If you want to remove the menu permanently, you need to put the script in the folder [" + getScriptFolderPath() + "]", de: "Wenn Sie das Menü dauerhaft entfernen wollen, müssen Sie das Skript im Ordner [" + getScriptFolderPath() + "] löschen!" }));
			dialogWin.close(100);
		}

		dialogWin.gControl = dialogWin.add("group");
		// dialogWin.gControl.preferredSize.width = 600;
		// dialogWin.gControl.alignChildren = ['right', 'center'];
		dialogWin.gControl.margins = 0;
		dialogWin.gControl.btLog = dialogWin.gControl.add("button", undefined, localize({ en: "Close", de: "Schließen" }), { name: "ok" });
		var res = dialogWin.show();
		if (res == 100) {
			uninstallMenu();
		}
		if (res == 99) {
			uninstallMenu();
			installMenu();
		}
	}
	catch (e) {
		log.warn(e.msg + " Zeile:" + e.line);
	}
}

// Open URL by Trevor http://creative-scripts.com  
function openURL(url) {
	if ($.os[0] === 'M') { // Mac  
		app.doScript('open location "' + url + '"', ScriptLanguage.APPLESCRIPT_LANGUAGE);
	} else { // Windows  
		app.doScript('CreateObject("WScript.Shell").Run("' + url + '")', ScriptLanguage.VISUAL_BASIC);
	}
}

/* Functions with fine grained tasks */
function beforeDisplyHanderlActiveDocument(event) {
	var scriptAction = event.parent;

	if (app.documents.length > 0 && app.layoutWindows.length > 0) {
		scriptAction.enabled = true;
	} else {
		scriptAction.enabled = false;
	}
}


/**  Init Log File and System */
function initLog() {
	var scriptFolderPath = getScriptFolderPath();
	if (scriptFolderPath.fullName.match(/lib$/)) {
		scriptFolderPath = scriptFolderPath.parent;
	}

	var logFolder = Folder(scriptFolderPath + "/log/");
	if (!logFolder.create()) {
		// Schreibe Log auf den Desktop
		logFolder = Folder(Folder.desktop + "/indesign-log/");
		logFolder.create();
	}
	if (px.appendLog) {
		var logFile = File(logFolder + "/" + px.projectName + "_log.txt");
	}
	else {
		var date = new Date();
		date = date.getFullYear() + "-" + pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + "_" + pad(date.getHours(), 2) + "-" + pad(date.getMinutes(), 2) + "-" + pad(date.getSeconds(), 2);
		var logFile = File(logFolder + "/" + date + "_" + px.projectName + "_log.txt");
	}

	if (px.debug) {
		log = idsLog.getLogger(logFile, "DEBUG", true);
		log.clearLog();
	}
	else {
		log = idsLog.getLogger(logFile, "INFO", false);
	}
	log.info("Starte " + px.projectName + " v " + px.version + " Debug: " + px.debug + " ScriptPrefVersion: " + app.scriptPreferences.version + " InDesign v " + app.version);
	return logFile;
}

/** Pad a numer witth leading zeros */
function pad(number, length, fill) {
	if (fill == undefined) fill = "0";
	var str = '' + number;
	while (str.length < length) {
		str = fill + str;
	}
	return str;
}

/** Get Filepath from current script  */
function getScriptFolderPath() {
	var skriptPath;
	$.level = 2;
	try {
		$.level = 0;
		skriptPath = app.activeScript.parent;
	}
	catch (e) {
		$.level = 2;
		/* We're running from the ESTK*/
		skriptPath = File(e.fileName).parent;
	}
	return skriptPath;
}
