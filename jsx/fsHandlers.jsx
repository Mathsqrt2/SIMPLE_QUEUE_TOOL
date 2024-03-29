function isItFirstUseJSX(path) {
    var newResponse = {
        isItFirstUse: true,
        actionTime: null,
    };

    var logPath = $.runScript.fixPath(path) + $.runScript.fixPath("\\config\\firstLaunchLog.json");
    var firstLaunchLog = new File(logPath);

    if (firstLaunchLog.exists) {
        newResponse.isItFirstUse = false;
    } else {
        var currentTime = new Date();
        newResponse.actionTime = currentTime.getTime();
        firstLaunchLog.open("w");
        firstLaunchLog.write(JSON.stringify(newResponse));
        firstLaunchLog.close();
    }

    var output = JSON.stringify(newResponse);
    return output;
}

function setOSValue(csinfo) {
    var obj = JSON.parse(csinfo);
    currentOS = obj.index;
}

function loadConfiguration(path) {
    var importConfig = new File($.runScript.fixPath(path) + $.runScript.fixPath("\\config\\config.json"));
    var result;
    if (importConfig.exists) {
        importConfig.open("r");
        result = importConfig.read();
        importConfig.close();
        return result;
    } else {
        return 0;
    }
}

function getFolderPath() {
    outputFolderPath = Folder.selectDialog("Choose the output directory");
    return outputFolderPath.fsName;
}

function getNewPreset(path) {
    newCustomEncodingPresetPath = File.openDialog("Choose preset", "Required: *.epr*", false);

    newCustomEncodingPresetPath.open("r");
    var backup = newCustomEncodingPresetPath.read();
    newCustomEncodingPresetPath.close();

    var dynamicPresetPath = $.runScript.fixPath(path) + $.runScript.fixPath("\\presets\\dynamic\\user_custom_preset.epr");
    var recoveryFile = new File(dynamicPresetPath);
    if (dynamicPresetPath.exists) {
        recoveryFile.remove();
        recoveryFile.close();
    }
    recoveryFile.open("w");
    recoveryFile.write(backup);
    recoveryFile.close();
}