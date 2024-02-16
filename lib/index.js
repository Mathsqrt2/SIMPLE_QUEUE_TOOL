let cs = new CSInterface;

const processRequest = () => {
    const confirmButton = document.getElementById("confirm");
    if (!confirmButton.classList.contains("confirm-locked")) {
        const functionParam = {
            type: document.getElementById("typeOfRenderingQueue").value,
            basedOn: document.getElementById("basedOn").value,
            basedOnIndex: document.getElementById("baseIndex").value == "" ? 0 : document.getElementById("baseIndex").value,
            applyFor: document.getElementById("rangeOfRenderingQueue").value,
            pluginPath: cs.getSystemPath(SystemPath.EXTENSION),
            searchPattern: document.getElementById("searchedValue").value == "" ? null : document.getElementById("searchedValue").value,
            encodingPreset: document.getElementById("encodingPreset").value == "" ? null : document.getElementById("encodingPreset").value,
            folderName: document.getElementById("newFolderName").value == "" ? null : document.getElementById("newFolderName").value,
            filesName: document.getElementById("newNamePattern").value == "" ? null : document.getElementById("newNamePattern").value,
            namesIndexOffset: document.getElementById("indexOffset").value == "" ? null : document.getElementById("indexOffset").value,
            numOn: document.getElementById("numOn").value == "yes" ? true : false,
            secureMode: document.getElementById("secureModeSwitch").value,
        }
        cs.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
    }
}
const patternFieldUnlock = (event) => {
    const prop = event.target.value;
    const field = document.getElementById("searchContainer");
    const addIndex = document.getElementById("addIndexOption");
    const selectedClipsOption = document.getElementById("selectedClipOption");
    const selectAudioOption = document.getElementById("selectedAudioOption");
    const basedOn = document.getElementById("basedOn");
    const type = document.getElementById("typeOfRenderingQueue");

    if (prop == "current sequence") {
        field.classList.add("hidden");
        addIndex.classList.add("hidden");
        selectedClipsOption.classList.remove("hidden");
        selectAudioOption.classList.remove("hidden");
    } else {
        field.classList.remove("hidden");
        if (type.value != "clips") {
            addIndex.classList.remove("hidden");
        }

        if (basedOn.value == "selected clips") {
            basedOn.value = basedOn.options[0].value;
        }
        if (basedOn.value == "selected clips audio") {
            basedOn.value = basedOn.options[3].value;
        }
        selectedClipsOption.classList.add("hidden");
        selectAudioOption.classList.add("hidden");
    }
}
const presetPathUnlock = (event) => {
    const confirmButton = document.getElementById("confirm");
    const pathHolder = document.getElementById("selectPresetPathContainer");
    const presetPathInput = document.getElementById("selectPresetPath");

    if (event.target.value == "custom") {
        pathHolder.classList.remove("hidden");
        confirmButton.classList.add("confirm-locked");

        presetPathInput.addEventListener("click", () => {
            cs.evalScript(`getNewPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
            confirmButton.classList.remove("confirm-locked");
        }, false);
    } else {
        pathHolder.classList.add("hidden");
        confirmButton.classList.remove("confirm-locked");
    }
}
const showElements = (array, mode) => {
    for (let option of array) {
        if (!mode) {
            option.classList.add("hidden");
        } else {
            option.classList.remove("hidden");
        }
    }
}
const baseIndexUnlock = (event) => {
    const val = event.target.value;
    const field = document.getElementById("baseIndexContainer");
    const videoOptions = document.getElementsByClassName("videoFileOption");
    const audioOptions = document.getElementsByClassName("audioFileOption");
    const presetSelect = document.getElementById("encodingPreset");
    const secureModeBox = document.getElementById("secure_mode");

    val == "clips on track" || val == "clip audio on track" ? field.classList.remove("hidden") : field.classList.add("hidden");
    val == "selected clips" || val == "selected clips audio" ? secureModeBox.classList.add("hidden") : secureModeBox.classList.remove("hidden");

    if (val == "each clip" || val == "clips on track" || val == "selected clips") {
        showElements(videoOptions, 1);
        showElements(audioOptions, 0);

        if (presetSelect.selectedIndex > 9) {
            presetSelect.selectedIndex = 0;
        }
    } else {
        showElements(videoOptions, 0);
        showElements(audioOptions, 1);

        if (presetSelect.selectedIndex <= 9) {
            presetSelect.selectedIndex = 10;
        }
    }
}
const secureTracksToggle = (event) => {
    let output = event.target.value == "enabled" ? true : false;

    const obj = {
        status: output,
    }
    cs.evalScript(`checkSecurityStatus('${JSON.stringify(obj)}')`);
}
const unlockBase = (event) => {
    const selectedClipsOption = document.getElementById("selectedClipOption");
    const selectedAudioOption = document.getElementById("selectedAudioOption");
    const secureModeBox = document.getElementById("secure_mode");
    const field = document.getElementById("basedOnPropertyBox");
    const field2 = document.getElementById("baseIndexContainer");
    const fieldSelect = document.getElementById("basedOn");

    const videoOptions = document.getElementsByClassName("videoFileOption");
    const audioOptions = document.getElementsByClassName("audioFileOption");
    const presetSelect = document.getElementById("encodingPreset");

    const range = document.getElementById("rangeOfRenderingQueue");
    const addIndex = document.getElementById("addIndexOption");

    if (event.target.value == "clips") {
        field.classList.remove("hidden");
        if (fieldSelect.value != "selected clips" && fieldSelect.value != "selected clips audio") {
            secureModeBox.classList.remove("hidden");
        } else {
            secureModeBox.classList.add("hidden");
        }
        if (fieldSelect.value == "clips on track") {
            field2.classList.remove("hidden");
        }
        if (range.value == "current sequence") {
            selectedClipsOption.classList.remove("hidden");
            selectedAudioOption.classList.remove("hidden");
        } else {
            selectedClipsOption.classList.add("hidden");
            selectedAudioOption.classList.add("hidden")
        }
        addIndex.classList.add("hidden");

        if (presetSelect.selectedIndex > 9) {
            showElements(audioOptions, 1);
            showElements(videoOptions, 0);
        } else {
            showElements(audioOptions, 0);
            showElements(videoOptions, 1);
        }

    } else if (event.target.value == "sequences") {
        secureModeBox.classList.add("hidden");
        field.classList.add("hidden");
        field2.classList.add("hidden");
        if (range.value == "current sequence") {
            addIndex.classList.add("hidden");
        } else {
            addIndex.classList.remove("hidden");
        }

        showElements(audioOptions, 1);
        showElements(videoOptions, 1);
    }
}
const setOutputDirectory = (event) => {
    cs.evalScript(`getFolderPath()`, function (res) {
        event.target.value = res;
    });
}
const loadValues = () => {
    cs.evalScript(`loadConfiguration('${cs.getSystemPath(SystemPath.EXTENSION)}')`, function (res) {
        if (res) {
            const renderType = document.getElementById("typeOfRenderingQueue");
            const numOn = document.getElementById("numOn");
            const numOnBox = document.getElementById("addIndexOption");
            const basedOn = document.getElementById("basedOn");
            const baseIndex = document.getElementById("baseIndex");
            const basedOnBox = document.getElementById("basedOnPropertyBox");
            const renderRange = document.getElementById("rangeOfRenderingQueue");
            const pattern = document.getElementById("searchedValue");
            const patternBox = document.getElementById("searchContainer");
            const preset = document.getElementById("encodingPreset");
            const newFolderName = document.getElementById("newFolderName");
            const outputName = document.getElementById("newNamePattern");
            const indexOffset = document.getElementById("indexOffset");
            const selectedClipsOption = document.getElementById("selectedClipOption");
            const selectAudioOption = document.getElementById("selectedAudioOption");
            const baseIndexBox = document.getElementById("baseIndexContainer");
            const videoOptions = document.getElementsByClassName("videoFileOption");
            const audioOptions = document.getElementsByClassName("audioFileOption");
            const secureModeSwitch = document.getElementById("secureModeSwitch");
            const secureModeBox = document.getElementById("secure_mode");

            let config = JSON.parse(res);

            if (config.type == "sequences") {
                renderType.value = renderType.options[1].value;
                if (config.applyFor != "current sequence") {
                    numOnBox.classList.remove("hidden");
                    if (config.numOn) {
                        numOn.value = numOn.options[0].value;
                    } else {
                        numOn.value = numOn.options[1].value;
                    }
                } else {
                    numOnBox.classList.add("hidden");
                }
                basedOnBox.classList.add("hidden");

            } else {
                switch (config.basedOn) {
                    case "each clip":
                        basedOn.value = basedOn.options[0].value;
                        break;
                    case "clips on track":
                        basedOn.value = basedOn.options[1].value;
                        baseIndexBox.classList.remove("hidden");
                        baseIndex.value = config.basedOnIndex;
                        break;
                    case "selected clips":
                        secureModeBox.classList.add("hidden");
                        secureModeSwitch.value = secureModeSwitch.options[1].value;
                        if (config.applyFor != "multiple sequences") {
                            basedOn.value = basedOn.options[2].value;
                        } else {
                            basedOn.value = basedOn.options[0].value;
                            selectedClipsOption.classList.add("hidden");
                            selectAudioOption.classList.add("hidden");
                        }
                        break;
                    case "each clip audio":
                        basedOn.value = basedOn.options[3].value;
                        break;
                    case "clip audio on track":
                        basedOn.value = basedOn.options[4].value;
                        baseIndexBox.classList.remove("hidden");
                        baseIndex.value = config.basedOnIndex;
                        break;
                    case "selected clips audio":
                        secureModeBox.classList.add("hidden");
                        secureModeSwitch.value = secureModeSwitch.options[1].value;
                        if (config.applyFor != "multiple sequences") {
                            basedOn.value = basedOn.options[5].value;
                        } else {
                            basedOn.value = basedOn.options[3].value;
                            selectedClipsOption.classList.add("hidden");
                            selectAudioOption.classList.add("hidden");
                        }
                        break;
                }
            }

            if (config.basedOn == "each clip" || config.basedOn == "clips on track" || config.basedOn == "selected clips") {
                showElements(audioOptions, 0);
                showElements(videoOptions, 1);
            } else {
                showElements(audioOptions, 1);
                showElements(videoOptions, 0);
            }

            switch (config.applyFor) {
                case "current sequence":
                    renderRange.value = renderRange.options[0].value;
                    break;
                case "multiple sequences":
                    if (config.type != "clips") {
                        numOnBox.classList.remove("hidden");
                    }
                    selectedClipsOption.classList.add("hidden");
                    selectAudioOption.classList.add("hidden");
                    renderRange.value = renderRange.options[1].value;
                    patternBox.classList.remove("hidden");
                    if (config.searchPattern) {
                        pattern.value = config.searchPattern;
                    }
                    break;
            }

            switch (config.encodingPreset) {
                case "h.264 | 64mbps | 384kbps":
                    preset.value = encodingPreset.options[0].value;
                    break;
                case "h.264 | 15mbps | 384kbps":
                    preset.value = encodingPreset.options[1].value;
                    break;
                case "h.264 | 64mbps | no audio":
                    preset.value = encodingPreset.options[2].value;
                    break;
                case "h.264 | 15mbps | no audio":
                    preset.value = encodingPreset.options[3].value;
                    break;
                case "vp9 | quality 60% | 384kbps":
                    preset.value = encodingPreset.options[4].value;
                    break;
                case "vp9 | quality 90% | 384kbps":
                    preset.value = encodingPreset.options[5].value;
                    break;
                case "vp9 | quality 60% | no audio":
                    preset.value = encodingPreset.options[6].value;
                    break;
                case "vp9 | quality 90% | no audio":
                    preset.value = encodingPreset.options[7].value;
                    break;
                case "quicktime | alpha | audio on":
                    preset.value = encodingPreset.options[8].value;
                    break;
                case "quicktime | alpha | audio off":
                    preset.value = encodingPreset.options[9].value;
                    break;
                case ".wav | umcompressed | 16 bit | stereo":
                    preset.value = encodingPreset.options[10].value;
                    break;
                case ".wav | umcompressed | 24 bit | stereo":
                    preset.value = encodingPreset.options[11].value;
                    break;
                case ".wav | umcompressed | 32 bit | stereo":
                    preset.value = encodingPreset.options[12].value;
                    break;
                case ".mp3 | 192kbps | 16 bit | stereo":
                    preset.value = encodingPreset.options[13].value;
                    break;
                case ".mp3 | 256kbps | 16 bit | stereo":
                    preset.value = encodingPreset.options[14].value;
                    break;
                case ".mp3 | 320kbps | 16 bit | stereo":
                    preset.value = encodingPreset.options[15].value;
                    break;
                case "custom":
                    preset.value = encodingPreset.options[16].value;
                    document.getElementById("selectPresetPathContainer").classList.remove("hidden");
                    document.getElementById("selectPresetPath").addEventListener("click", () => {
                        cs.evalScript(`getNewPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                    });
                    cs.evalScript(`$.runScript.loadPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                    break;
            }

            if (config.folderName) {
                newFolderName.value = config.folderName;
            }
            if (config.filesName) {
                outputName.value = config.filesName;
            }
            if (config.namesIndexOffset) {
                indexOffset.value = config.namesIndexOffset;
            }
            if (config.secureMode) {
                secureModeSwitch.value = secureModeSwitch.options[0].value;
            } else {
                secureModeSwitch.value = secureModeSwitch.options[1].value;
            }
        }
    });
}
const checkSystemInfo = () => {
    const currentOS = {
        os: cs.getOSInformation().toLowerCase(),
    }
    currentOS.index = currentOS.os.indexOf('win') >= 0 ? 0 : 1;

    cs.evalScript(`setOSValue('${JSON.stringify(currentOS)}')`);
}
const supportReference = () => {
    cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/support");
}
const isItFirstUse = () => {
    cs.evalScript(`isItFirstUseJSX('${cs.getSystemPath(SystemPath.EXTENSION)}')`, function (res) {
        const data = JSON.parse(res);
        if (data.isItFirstUse) {
            cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/simple-queue-tool-use-guide");
        }
    })

}
const attachBodyScripts = () => {
    document.getElementById("typeOfRenderingQueue").addEventListener("change", unlockBase)
    document.getElementById("confirm").addEventListener("click", processRequest);
    document.getElementById("rangeOfRenderingQueue").addEventListener("change", patternFieldUnlock);
    document.getElementById("encodingPreset").addEventListener("change", presetPathUnlock);
    document.getElementById("basedOn").addEventListener("change", baseIndexUnlock);
    document.getElementById("newOutputPath").addEventListener("click", setOutputDirectory);
    document.getElementById("secureModeSwitch").addEventListener("change", secureTracksToggle);
    document.getElementById("supportButton").addEventListener("click", supportReference);
}

addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", checkSystemInfo);
addEventListener("load", isItFirstUse);
addEventListener("load", attachBodyScripts);
addEventListener("load", loadValues);