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
            secureMode: document.getElementById("secureModeSwitch").value == "enabled" ? true : false,
            renderAfterQueue: document.getElementById("renderSwitch").value == "enabled" ? true : false,
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
    } else if (prop == "multiple sequences") {
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
    } else if (prop == "selected sequences") {
        field.classList.add("hidden");
        addIndex.classList.remove("hidden");
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
    const bonusOption = document.getElementById("bonusOption");

    val == "clips on track" || val == "clip audio on track" ? field.classList.remove("hidden") : field.classList.add("hidden");
    if (val == "selected clips" || val == "selected clips audio") {
        secureModeBox.classList.add("hidden")
        bonusOption.classList.add("hidden");
        if (bonusOption.value == "selected sequences") {
            bonusOption.selectedIndex = 0;
        }
    } else {
        secureModeBox.classList.remove("hidden");
        bonusOption.classList.remove("hidden");
    }

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
const unlockBase = (event) => {
    const app = getAppStructure();

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
const getAppStructure = () => {
    return {
        root: document.getElementById("app_container"),
        title: document.getElementById("app_title"),
        support: document.getElementById("supportButton"),
        queueType: document.getElementById("typeOfRenderingQueue"),
        numBox: document.getElementById("addIndexOption"),
        num: document.getElementById("numOn"),
        basedOnBox: document.getElementById("basedOnPropertyBox"),
        basedOnVal: document.getElementById("basedOn"),
        selectedClips: document.getElementById("selectedClipOption"),
        selectedAudio: document.getElementById("selectedAudioOption"),
        baseIndx: document.getElementById("baseIndex"),
        baseIndxbox: document.getElementById("baseIndexContainer"),
        queueRange: document.getElementById("rangeOfRenderingQueue"),
        selectedSeq: document.getElementById("bonusOption"),
        searchBox: document.getElementById("searchContainer"),
        searchVal: document.getElementById("searchedValue"),
        encPreset: document.getElementById("encodingPreset"),
        customPathBox: document.getElementById("selectPresetPathContainer"),
        customPath: document.getElementById("selectPresetPath"),
        newPath: document.getElementById("newOutputPath"),
        newFolderName: document.getElementById("newFolderName"),
        newNamePattern: document.getElementById("newNamePattern"),
        indxOffs: document.getElementById("indexOffset"),
        secureModeSwitch: document.getElementById("secureModeSwitch"),
        secureBox: document.getElementById("secure_mode"),
        renderBox: document.getElementById("render_after_queue"),
        renderSwitch: document.getElementById("renderSwitch"),
        videoOptions: document.getElementsByClassName("videoFileOption"),
        audioOptions: document.getElementsByClassName("audioFileOption"),
        confirm: {
            section: document.getElementById("confirm_section"),
            button: document.getElementById("confirm"),
        }
    }
}

const appInit = () => {
    const currentOS = {
        os: cs.getOSInformation().toLowerCase(),
    }
    currentOS.index = currentOS.os.indexOf('win') >= 0 ? 0 : 1;
    cs.evalScript(`setOSValue('${JSON.stringify(currentOS)}')`);
    cs.evalScript('$.runScript.attachListener()');
    cs.evalScript(`isItFirstUseJSX('${cs.getSystemPath(SystemPath.EXTENSION)}')`, function (res) {
        const data = JSON.parse(res);
        if (data.isItFirstUse) {
            cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/simple-queue-tool-use-guide");
        }
    })
    cs.evalScript(`loadConfiguration('${cs.getSystemPath(SystemPath.EXTENSION)}')`, function (res) {
        if (res) {
            const app = getAppStructure();
            const config = JSON.parse(res);

            if (config.type == "sequences") {
                app.queueType.value = app.queueType.options[1].value;
                if (config.applyFor != "current sequence") {
                    app.numBox.classList.remove("hidden");
                    if (config.numOn) {
                        app.num.value = app.num.options[0].value;
                    } else {
                        app.num.value = app.num.options[1].value;
                    }
                } else {
                    app.numBox.classList.add("hidden");
                }
                app.basedOnBox.classList.add("hidden");

            } else {
                switch (config.basedOn) {
                    case "each clip":
                        app.basedOnVal.selectedIndex = 0;
                        break;
                    case "clips on track":
                        app.basedOnVal.selectedIndex = 1;
                        app.baseIndxbox.classList.remove("hidden");
                        app.baseIndx.value = config.basedOnIndex;
                        break;
                    case "selected clips":
                        app.secureBox.classList.add("hidden");
                        app.secureModeSwitch.value = app.secureModeSwitch.options[1].value;
                        if (config.applyFor != "multiple sequences") {
                            app.basedOnVal.selectedIndex = 2;
                        } else {
                            app.basedOnVal.selectedIndex = 0;
                            app.selectedClips.classList.add("hidden");
                            app.selectedAudio.classList.add("hidden");
                        }
                        break;
                    case "each clip audio":
                        app.basedOnVal.selectedIndex = 3;
                        break;
                    case "clip audio on track":
                        app.basedOnVal.selectedIndex = 4;
                        app.baseIndxbox.classList.remove("hidden");
                        app.baseIndx.value = config.basedOnIndex;
                        break;
                    case "selected clips audio":
                        app.secureBox.classList.add("hidden");
                        app.secureModeSwitch.value = app.secureModeSwitch.options[1].value;
                        if (config.applyFor != "multiple sequences") {
                            app.basedOnVal.selectedIndex = 5;
                        } else {
                            app.basedOnVal.selectedIndex = 3;
                            app.selectedClips.classList.add("hidden");
                            app.selectedAudio.classList.add("hidden");
                        }
                        break;
                }
            }

            if (config.basedOn == "each clip" || config.basedOn == "clips on track" || config.basedOn == "selected clips") {
                showElements(app.audioOptions, 0);
                showElements(app.videoOptions, 1);
            } else {
                showElements(app.audioOptions, 1);
                showElements(app.videoOptions, 0);
            }

            switch (config.applyFor) {
                case "current sequence":
                    app.queueRange.selectedIndex = 0;
                    break;
                case "multiple sequences":
                    if (config.type != "clips") {
                        app.numBox.classList.remove("hidden");
                    }
                    app.selectedClips.classList.add("hidden");
                    app.selectedAudio.classList.add("hidden");
                    app.queueRange.selectedIndex = 1;
                    app.searchBox.classList.remove("hidden");
                    if (config.searchPattern) {
                        app.searchVal.value = config.searchPattern;
                    }
                    break;
                case "selected sequences":
                    app.selectedSeq.classList.remove("hidden");
                    app.queueRange.selectedIndex = 2;
                    break;
            }

            switch (config.encodingPreset) {
                case "h.264 | 64mbps | 384kbps":
                    app.encPreset.selectedIndex = 0;
                    break;
                case "h.264 | 15mbps | 384kbps":
                    app.encPreset.selectedIndex = 1;
                    break;
                case "h.264 | 64mbps | no audio":
                    app.encPreset.selectedIndex = 2;
                    break;
                case "h.264 | 15mbps | no audio":
                    app.encPreset.selectedIndex = 3;
                    break;
                case "vp9 | quality 60% | 384kbps":
                    app.encPreset.selectedIndex = 4;
                    break;
                case "vp9 | quality 90% | 384kbps":
                    app.encPreset.selectedIndex = 5;
                    break;
                case "vp9 | quality 60% | no audio":
                    app.encPreset.selectedIndex = 6;
                    break;
                case "vp9 | quality 90% | no audio":
                    app.encPreset.selectedIndex = 7;
                    break;
                case "quicktime | alpha | audio on":
                    app.encPreset.selectedIndex = 8;
                    break;
                case "quicktime | alpha | audio off":
                    app.encPreset.selectedIndex = 9;
                    break;
                case ".wav | umcompressed | 16 bit | stereo":
                    app.encPreset.selectedIndex = 10;
                    break;
                case ".wav | umcompressed | 24 bit | stereo":
                    app.encPreset.selectedIndex = 11;
                    break;
                case ".wav | umcompressed | 32 bit | stereo":
                    app.encPreset.selectedIndex = 12;
                    break;
                case ".mp3 | 192kbps | 16 bit | stereo":
                    app.encPreset.selectedIndex = 13;
                    break;
                case ".mp3 | 256kbps | 16 bit | stereo":
                    app.encPreset.selectedIndex = 14;
                    break;
                case ".mp3 | 320kbps | 16 bit | stereo":
                    app.encPreset.selectedIndex = 15;
                    break;
                case "custom":
                    app.encPreset.selectedIndex = 16;
                    app.customPathBox.classList.remove("hidden");
                    app.customPath.addEventListener("click", () => {
                        cs.evalScript(`getNewPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                    });
                    cs.evalScript(`$.runScript.loadPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                    break;
            }

            if (config.folderName) {
                app.newFolderName.value = config.folderName;
            }
            if (config.filesName) {
                app.newNamePattern.value = config.filesName;
            }
            if (config.namesIndexOffset) {
                app.indxOffs.value = config.namesIndexOffset;
            }
            if (config.secureMode) {
                app.secureModeSwitch.selectedIndex = 0;
            } else {
                app.secureModeSwitch.selectedIndex = 1;
            }
            if (config.renderAfterQueue) {
                app.renderSwitch.selectedIndex = 0;
            } else {
                app.renderSwitch.selectedIndex = 1;
            }
        }
    });
}
const attachBodyScripts = () => {
    const app = getAppStructure();
    app.queueType.addEventListener("change", unlockBase)
    app.confirm.button.addEventListener("click", processRequest);
    app.queueRange.addEventListener("change", patternFieldUnlock);
    app.encPreset.addEventListener("change", presetPathUnlock);
    app.basedOnVal.addEventListener("change", baseIndexUnlock);
    app.newPath.addEventListener("click", (e) => cs.evalScript(`getFolderPath()`, function (res) { e.target.value = res; }));
    app.support.addEventListener("click", () => cs.openURLInDefaultBrowser("https://mbugajski.pl/plugins/support"));
}

addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", appInit);
addEventListener("load", attachBodyScripts);