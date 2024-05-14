let adobeApp = new CSInterface;
let app;

const processRequest = () => {
    if (!app.confirm.button.classList.contains("confirm-locked")) {
        const functionParam = {
            type: app.queueType.value,
            basedOn: app.basedOnVal.value,
            basedOnIndex: app.baseIndx.value || 0,
            applyFor: app.queueRange.value,
            pluginPath: adobeApp.getSystemPath(SystemPath.EXTENSION),
            searchPattern: app.searchVal.value || null,
            encodingPreset: app.encPreset.selectedIndex,
            folderName: app.newFolderName.value || null,
            filesName: app.newNamePattern.value || null,
            namesIndexOffset: app.indxOffs.value || null,
            numOn: app.num.value == "yes" ? true : false,
            secureMode: app.secureModeSwitch.value == "enabled" ? true : false,
            renderAfterQueue: app.renderSwitch.value == "enabled" ? true : false,
        }
        localStorage.config = JSON.stringify(functionParam);
        adobeApp.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
    }
}
const patternFieldUnlock = (event) => {
    const val = event.target.value;

    if (val == "current sequence") {
        app.searchBox.classList.add("hidden");
        app.numBox.classList.add("hidden");
        app.selectedClips.classList.remove("hidden");
        app.selectedAudio.classList.remove("hidden");
    } else if (val == "multiple sequences") {
        app.searchBox.classList.remove("hidden");
        if (app.queueType.value != "clips") {
            app.numBox.classList.remove("hidden");
        }
        if (app.basedOnVal.value == "selected clips") {
            app.basedOnVal.value = app.basedOnVal.options[0].value;
        }
        if (app.basedOnVal.value == "selected clips audio") {
            app.basedOnVal.value = app.basedOnVal.options[3].value;
        }
        app.selectedClips.classList.add("hidden");
        app.selectedAudio.classList.add("hidden");
    } else if (val == "selected sequences") {
        app.searchBox.classList.add("hidden");
        app.numBox.classList.remove("hidden");
        if (app.basedOnVal.value == "selected clips") {
            app.basedOnVal.value = app.basedOnVal.options[0].value;
        }
        if (app.basedOnVal.value == "selected clips audio") {
            app.basedOnVal.value = app.basedOnVal.options[3].value;
        }
        app.selectedClips.classList.add("hidden");
        app.selectedAudio.classList.add("hidden");
    }
}
const presetPathUnlock = (event) => {
    if (event.target.value == "custom") {
        app.customPathBox.classList.remove("hidden");
        app.confirm.button.classList.add("confirm-locked");

        app.customPath.addEventListener("click", () => {
            adobeApp.evalScript(`getNewPreset('${adobeApp.getSystemPath(SystemPath.EXTENSION)}')`);
            app.confirm.button.classList.remove("confirm-locked");
        }, false);
    } else {
        app.customPathBox.classList.add("hidden");
        app.confirm.button.classList.remove("confirm-locked");
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

    val == "clips on track" || val == "clip audio on track" ? app.baseIndxbox.classList.remove("hidden") : app.baseIndxbox.classList.add("hidden");
    if (val == "selected clips" || val == "selected clips audio") {
        app.secureBox.classList.add("hidden")
        app.selectedSeq.classList.add("hidden");
        if (app.selectedSeq.value == "selected sequences") {
            app.selectedSeq.selectedIndex = 0;
        }
    } else {
        app.secureBox.classList.remove("hidden");
        app.selectedSeq.classList.remove("hidden");
    }

    if (val == "each clip" || val == "clips on track" || val == "selected clips") {
        showElements(app.videoOptions, 1);
        showElements(app.audioOptions, 0);

        if (app.encPreset.selectedIndex > 9) {
            app.encPreset.selectedIndex = 0;
        }
    } else {
        showElements(app.videoOptions, 0);
        showElements(app.audioOptions, 1);

        if (app.encPreset.selectedIndex <= 9) {
            app.encPreset.selectedIndex = 10;
        }
    }
}
const unlockBase = (event) => {
    if (event.target.value == "clips") {
        app.basedOnBox.classList.remove("hidden");
        if (app.basedOnVal.value != "selected clips" && app.basedOnVal.value != "selected clips audio") {
            app.secureBox.classList.remove("hidden");
        } else {
            app.secureBox.classList.add("hidden");
        }
        if (app.basedOnVal.value == "clips on track") {
            app.baseIndxbox.classList.remove("hidden");
        }
        if (app.queueRange.value == "current sequence") {
            app.selectedClips.classList.remove("hidden");
            app.selectedAudio.classList.remove("hidden");
        } else {
            app.selectedClips.classList.add("hidden");
            app.selectedAudio.classList.add("hidden")
        }
        app.numBox.classList.add("hidden");

        if (app.encPreset.selectedIndex > 9) {
            showElements(app.audioOptions, 1);
            showElements(app.videoOptions, 0);
        } else {
            showElements(app.audioOptions, 0);
            showElements(app.videoOptions, 1);
        }

    } else if (event.target.value == "sequences") {
        app.secureBox.classList.add("hidden");
        app.basedOnBox.classList.add("hidden");
        app.baseIndxbox.classList.add("hidden");
        if (app.queueRange.value == "current sequence") {
            app.numBox.classList.add("hidden");
        } else {
            app.numBox.classList.remove("hidden");
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
const restoreValuesFromConfig = (configuration) => {
    const config = JSON.parse(configuration);

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
    app.encPreset.selectedIndex = config.encodingPreset;
    if (app.encPreset.selectedIndex == 16) {
        app.customPathBox.classList.remove("hidden");
        app.customPath.addEventListener("click", () => {
            adobeApp.evalScript(`getNewPreset('${adobeApp.getSystemPath(SystemPath.EXTENSION)}')`);
        });
        adobeApp.evalScript(`$.runScript.loadPreset()`, function (res) {
            app.customPath.value = res;
        });
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
const appInit = () => {
    app = getAppStructure();
    const currentOS = {
        os: adobeApp.getOSInformation().toLowerCase(),
    }
    currentOS.index = currentOS.os.indexOf('win') >= 0 ? 0 : 1;
    adobeApp.evalScript(`setOSValue('${JSON.stringify(currentOS)}')`);
    adobeApp.evalScript('$.runScript.attachListener()');
    if (localStorage.config) {
        restoreValuesFromConfig(localStorage.config);
    }
    if (!localStorage.isItFirstUse) {
        const timestamp = Date.now();
        localStorage.isItFirstUse = JSON.stringify({ firstUse: timestamp });
        adobeApp.openURLInDefaultBrowser("https://mbugajski.pl/plugins/simple-queue-tool-use-guide");
    }
}
const attachBodyScripts = () => {
    app.queueType.addEventListener("change", unlockBase)
    app.confirm.button.addEventListener("click", processRequest);
    app.queueRange.addEventListener("change", patternFieldUnlock);
    app.encPreset.addEventListener("change", presetPathUnlock);
    app.basedOnVal.addEventListener("change", baseIndexUnlock);
    app.newPath.addEventListener("click", (e) => adobeApp.evalScript(`getFolderPath()`, function (res) { e.target.value = res; }));
    app.support.addEventListener("click", () => adobeApp.openURLInDefaultBrowser("https://mbugajski.pl/plugins/support"));
}
addEventListener("contextmenu", e => e.preventDefault());
addEventListener("load", appInit);
addEventListener("load", attachBodyScripts);