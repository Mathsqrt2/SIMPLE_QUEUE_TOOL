#include fsHandlers.jsx

var proj;
var currentSequence;
var outputFolderPath = "";
var newCustomEncodingPresetPath = "";
var newDirectoryName;
var newPluginPath;
var formConfiguration;
var currentOS;
var isSecurityEnabled = true;
var startEncoding = false;
var selectedItems = [];

$.runScript = {
    processRequest: function(userConfig) {
        proj = app.project;
        currentSequence = proj.activeSequence;
        config = JSON.parse(userConfig);
        newDirectoryName = config.folderName;
        newPluginPath = this.fixPath(config.pluginPath);
        isSecurityEnabled = config.secureMode;
        startEncoding = config.renderAfterQueue;
        var configSave = new File(newPluginPath + this.fixPath("\\config\\config.json"));
        configSave.open("w");
        configSave.write(userConfig);
        configSave.close();

        if (config.applyFor == "current sequence") {
            if (config.type == "clips") {
                this.addAllClipsToMediaEncoderQueue(currentSequence);
                if (startEncoding) {
                    app.encoder.startBatch();
                }

            } else {
                this.addToExportAllCurrentSequenceDuration(currentSequence, -1);
                if (startEncoding) {
                    app.encoder.startBatch();
                }
            }
        } else if (config.applyFor == "multiple sequences") {
            if (config.searchPattern != null) {
                if (proj.sequences.numSequences > 0) {

                    var sequencesFound = [];
                    var toFind = config.searchPattern.toLowerCase();
                    var currentSequenceName;

                    for (var i = 0; i < proj.sequences.numSequences; i++) {
                        currentSequenceName = proj.sequences[i].name.toLowerCase();
                        if (currentSequenceName.search(toFind) >= 0) {
                            sequencesFound.push(proj.sequences[i]);
                        }
                    }

                    if (sequencesFound.length < 1) {
                        alert("No matches found");
                        return 0;
                    }

                    if (config.type == "clips") {
                        for (var j = 0; j < sequencesFound.length; j++) {
                            currentSequence = sequencesFound[j];
                            proj.openSequence(currentSequence.sequenceID);
                            this.addAllClipsToMediaEncoderQueue(currentSequence);
                        }
                        if (startEncoding) {
                            app.encoder.startBatch();
                        }
                    } else {
                        var numOn;
                        for (var j = 0; j < sequencesFound.length; j++) {
                            currentSequence = sequencesFound[j];
                            proj.openSequence(currentSequence.sequenceID);
                            numOn = config.numOn == true ? numOn = j : -1;
                            this.addToExportAllCurrentSequenceDuration(currentSequence, numOn);
                        };
                        if (startEncoding) {
                            app.encoder.startBatch();
                        }
                    }

                } else {
                    alert("This project doesn't contain any sequences");
                }
            } else {
                if (config.type == "clips") {
                    if (proj.sequences.numSequences > 0) {
                        for (var i = 0; i < proj.sequences.numSequences; i++) {
                            currentSequence = proj.sequences[i];
                            proj.openSequence(currentSequence.sequenceID);
                            this.addAllClipsToMediaEncoderQueue(currentSequence);
                        }
                        if (startEncoding) {
                            app.encoder.startBatch();
                        }
                    } else {
                        alert("This project doesn't contain any sequences");
                    }
                } else {
                    var numOn;
                    if (proj.sequences.numSequences > 0) {
                        for (var i = 0; i < proj.sequences.numSequences; i++) {
                            numOn = config.numOn == true ? numOn = i : -1;
                            currentSequence = proj.sequences[i];
                            proj.openSequence(currentSequence.sequenceID);
                            this.addToExportAllCurrentSequenceDuration(currentSequence, numOn);
                        }
                        if (startEncoding) {
                            app.encoder.startBatch();
                        }
                    } else {
                        alert("This project doesn't contain any sequences");
                    }
                }
            }
        } else if (config.applyFor == "selected sequences") {
            var encodingQueue;
            var currentItem;
            var numOn;
            if (selectedItems.length > 0) {
                encodingQueue = [];
                for (var i = 0; i < selectedItems.length; i++) {
                    currentItem = selectedItems[i];
                    for (var j = 0; j < proj.sequences.numSequences; j++) {
                        currentSequence = proj.sequences[j];
                        if (currentItem.name == currentSequence.name) {
                            if (config.type == "clips") {
                                proj.openSequence(currentSequence.sequenceID);
                                this.addAllClipsToMediaEncoderQueue(currentSequence);
                            } else {
                                numOn = config.numOn == true ? numOn = l : -1;
                                proj.openSequence(currentSequence.sequenceID);
                                this.addToExportAllCurrentSequenceDuration(currentSequence, numOn);
                            }
                        }
                    }
                }
                if (startEncoding) {
                    app.encoder.startBatch();
                }

            } else {
                alert("No selected items found");
            }

        }
    },
    attachListener: function() {
        app.bind("onSourceClipSelectedInProjectPanel", this.selectionHandling);
    },
    selectionHandling: function(event) {
        if (config.applyFor == "selected sequences") {
            if (event.length) {
                selectedItems = [];
                for (var i = 0; i < event.length; i++) {
                    var currentElement = event[i];
                    var foundElement = {
                        name: currentElement.name,
                        type: currentElement.type,
                    }
                    selectedItems.push(foundElement);
                }
            } else {
                selectedItems = [];
            }
        }
    },
    addToExportAllCurrentSequenceDuration: function(localSequence, localIteration) {
        var clipIn, clipOut;
        var availableTracks;

        if (config.basedOn == "each clip" || config.basedOn == "clips on track" || config.basedOn == "selected clips") {
            monit = "Video";
            availableTracks = localSequence.videoTracks;
        } else {
            monit = "Audio";
            availableTracks = localSequence.audioTracks;
        }

        if (localSequence) {
            if (availableTracks.length > 0) {
                var firstClip = availableTracks[0].clips;
                if (firstClip.length > 0) {
                    clipIn = firstClip[0].start.seconds;
                    clipOut = firstClip[0].end.seconds;

                    for (var i = 0; i < availableTracks.length; i++) {
                        var currentTrack = availableTracks[i];
                        for (var j = 0; j < currentTrack.clips.length; j++) {
                            var currentClip = availableTracks[i].clips[j];
                            if (currentClip.start.seconds < clipIn) {
                                clipIn = currentClip.start.seconds;
                            }
                            if (currentClip.end.seconds > clipOut) {
                                clipOut = currentClip.end.seconds;
                            }
                        }
                    }

                    this.trimArea(clipIn, clipOut);
                    this.addToAME(localIteration);

                } else {
                    if (config.applyFor != "multiple sequences") {
                        alert("sequence is empty!");
                    }
                }
            } else {
                if (config.applyFor != "multiple sequences") {
                    alert(monit + " tracks missing!");
                }
            }
        } else {
            if (config.applyFor != "multiple sequences") {
                alert("Specified sequence doesn't exist!");
            }
        }
    },
    processEeachTrack: function(tracks) {
        var index = 0;

        for (var i = 0; i < tracks.length; i++) {
            var currentTrack = tracks[i];

            this.secureTracks(tracks, 1);
            currentTrack.setMute(0);
            currentTrack.setLocked(0);

            for (j = 0; j < currentTrack.clips.length; j++) {
                this.selectClipsAndAddToExportQueue([currentTrack.clips[j]], index++);
            }
        }

        this.secureTracks(tracks, 0);
        return index;
    },
    selectClipsAndAddToExportQueue: function(clips, index) {
        for (var i = 0; i < clips.length; i++) {
            var iteration = index == null || index == undefined ? i : index;
            this.trimArea(clips[i].start.seconds, clips[i].end.seconds);
            this.addToAME(iteration);
        }
    },
    addAllClipsToMediaEncoderQueue: function(localSequence) {
        var availableTracks;
        var monit;

        if (config.basedOn == "each clip" || config.basedOn == "clips on track" || config.basedOn == "selected clips") {
            monit = "Video";
            availableTracks = localSequence.videoTracks;
        } else {
            monit = "Audio";
            availableTracks = localSequence.audioTracks;
        }

        if (localSequence) {
            if (availableTracks.length > 0) {
                if (config.basedOn == "each clip" || config.basedOn == "each clip audio") {
                    this.processEeachTrack(availableTracks);
                } else if (config.basedOn == "clips on track" || config.basedOn == "clip audio on track") {
                    if (config.basedOnIndex < availableTracks.length && config.basedOnIndex >= 0) {
                        this.secureTracks(availableTracks, 1);
                        var currentTrack = [availableTracks[config.basedOnIndex]];
                        this.processEeachTrack(currentTrack);
                        this.secureTracks(availableTracks, 0);
                    } else {
                        alert("Track with specified index doesn't exist");
                    }
                } else if (config.basedOn == "selected clips" || config.basedOn == "selected clips audio") {
                    var selectedClipsNumber = 0;
                    var selectedClips = [];

                    for (var i = 0; i < availableTracks.length; i++) {
                        var currentTrack = availableTracks[i];
                        for (var j = 0; j < currentTrack.clips.length; j++) {
                            var currentClip = currentTrack.clips[j];
                            if (currentClip.isSelected()) {
                                selectedClips.push(currentClip);
                                selectedClipsNumber++;
                            }
                        }
                    }
                    if (!selectedClipsNumber) {
                        alert("Please select clips to export");
                    } else {
                        this.selectClipsAndAddToExportQueue(selectedClips);
                    }
                }
            } else {
                alert(monit + " tracks missing!");
            }
        } else {
            alert("Specified sequence doesn't exists!");
        }
    },
    secureTracks: function(tracks, mode) {
        if (isSecurityEnabled) {
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].setMute(mode);
                tracks[i].setLocked(mode);
            }
        }
    },
    trimArea: function(inp, oup) {
        proj.activeSequence.setOutPoint(oup);
        proj.activeSequence.setInPoint(inp);
    },
    exportingPreset: function(mode) {
        var outPresetPath;
        var presetsFile = new File(newPluginPath + this.fixPath("\\presets\\presets.json"));
        presetsFile.open("r");
        var presetsList = JSON.parse(presetsFile.read());
        var currentPreset = presetsList[config.encodingPreset];
        presetsFile.close();

        if (currentPreset == "custom") {
            if (newCustomEncodingPresetPath != "") {
                outPresetPath = newCustomEncodingPresetPath.fsName;
            } else {
                alert("You haven't chosen any preset path");
                newCustomEncodingPresetPath = getNewPreset();
                return 0;
            }
        } else {
            outPresetPath = newPluginPath + this.fixPath(currentPreset);
        }

        var outPreset = new File(outPresetPath);
        var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
        if (mode == 1) {
            return outPresetPath;
        } else {
            return "." + outFormExt;
        }
    },
    fileOutputPath: function(paramIterator) {
        var iteration, renderFileName;
        var currentIteration = Number(paramIterator) + Number(config.namesIndexOffset);
        if (currentIteration < 0) {
            iteration = "";
        } else if (currentIteration <= 9) {
            iteration = "_000" + currentIteration;
        } else if (currentIteration > 9 && currentIteration <= 99) {
            iteration = "_00" + currentIteration;
        } else if (currentIteration > 99 && currentIteration <= 999) {
            iteration = "_0" + currentIteration;
        } else {
            iteration = "_" + currentIteration;
        }

        if (config.filesName != null && config.filesName != "") {
            if (config.applyFor != "current sequence" && config.applyFor != null) {
                renderFileName = currentSequence.name + "_" + config.filesName + iteration;
            } else {
                renderFileName = config.filesName + iteration;
            }
        } else {
            renderFileName = currentSequence.name + iteration;
        }
        return renderFileName;
    },
    outputDirectoryPath: function() {
        if (outputFolderPath.fsName != null && outputFolderPath.fsName != "" && outputFolderPath.fsName != undefined) {
            return outputFolderPath.fsName;
        } else {
            return app.project.path.substr(0, app.project.path.length - app.project.name.length);
        }
    },
    loadPreset: function() {
        var customPresetPath = newPluginPath + this.fixPath("\\presets\\dynamic\\user_custom_preset.epr");
        var presetInstance = new File(customPresetPath);
        if (presetInstance.exists) {
            newCustomEncodingPresetPath = presetInstance;
            return "LOADED FROM CONFIG";
        } else {
            getNewPreset(path);
            return "SET NEW PATH";
        }
    },
    prepareNewFolder: function(outPath) {
        if (newDirectoryName != undefined && newDirectoryName != null && newDirectoryName != "") {
            var f = new Folder(outPath + this.fixPath("/") + newDirectoryName);
            if (!f.exists) {
                f.create();
            }
            return newDirectoryName + this.fixPath("/");
        } else {
            return "";
        }
    },
    fixPath: function(pathToFix) {
        var newPath = pathToFix;
        if (!currentOS) {
            while (newPath.indexOf("/") > 0) {
                newPath = newPath.replace('/', '\\');
            }
            return newPath;
        } else {
            while (newPath.indexOf("\\") > 0) {
                newPath = newPath.replace("\\", "/");
            }
            return newPath;
        }
    },
    addToAME: function(nameIterator) {
        var newFileName = this.fileOutputPath(nameIterator) + this.exportingPreset();
        var outputFilePath;

        outputFilePath = this.outputDirectoryPath() + this.fixPath('\\') + this.prepareNewFolder(this.outputDirectoryPath()) + newFileName;

        var checkIfExists = new File(outputFilePath);
        if (outputFilePath.exists) {
            var destroyCurrent = confirm("A file with that name already exist: Do You want to overwrite?", false, "are You sure?");
            if (destroyCurrent) {
                checkIfExists.remove();
                checkIfExists.close();
            }
        }
        app.encoder.encodeSequence(currentSequence, outputFilePath, this.exportingPreset(1), app.encoder.ENCODE_IN_TO_OUT, 0);
    },
}