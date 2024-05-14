function setOSValue(csinfo) {
    var obj = JSON.parse(csinfo);
    currentOS = obj.index;
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