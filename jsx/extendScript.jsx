var outputFolderPath = "";
var newCustomEncodingPresetPath = "";
var newDirectoryName;
var newPluginPath;
var formConfiguration;
var currentOS;
var isSecurityEnabled = true;

$.runScript = {
	processRequest: function(userConfig){
		proj = app.project;
		config = JSON.parse(userConfig);
		newDirectoryName = config.folderName;
		currentSequence = proj.activeSequence;
		newPluginPath = this.fixPath(config.pluginPath);

		var configSave = new File(newPluginPath + this.fixPath("\\config\\config.json"));
		configSave.open("w");
		configSave.write(userConfig);
		configSave.close();

		if(config.applyFor == "current sequence"){
			if(config.type == "clips"){
				this.addAllClipsToMediaEncoderQueue(currentSequence);
			} else {
				this.addToExportAllCurrentSequenceDuration(currentSequence,-1);
			} 
		} else if(config.applyFor == "multiple sequences") {
			if(config.searchPattern != null){
				if(proj.sequences.numSequences > 0){

					var sequencesFound = [];
					var toFind = config.searchPattern.toLowerCase();
					var currentSequenceName;

					for(var i = 0; i < proj.sequences.numSequences; i++){
						currentSequenceName = proj.sequences[i].name.toLowerCase();
						if(currentSequenceName.search(toFind) >= 0){
							sequencesFound.push(proj.sequences[i]);
						}
					}

					if(sequencesFound.length < 1){
						alert("No matches found");
					return 0;
					}

					if(config.type == "clips"){
						for(var j = 0; j < sequencesFound.length; j++){
							currentSequence = sequencesFound[j];
							proj.openSequence(currentSequence.sequenceID);
							this.addAllClipsToMediaEncoderQueue(currentSequence);
						}
					} else {
						var numOn;
						for(var j = 0; j < sequencesFound.length; j++){
							currentSequence = sequencesFound[j];
							proj.openSequence(currentSequence.sequenceID);
							numOn = config.numOn == true ? numOn = j : -1;
							this.addToExportAllCurrentSequenceDuration(currentSequence,numOn);
						};
					} 
		
			} else {
				alert("This project doesn't contain any sequences");
			} 
			} else {
				if(config.type == "clips"){
					if(proj.sequences.numSequences > 0){
						for(var i = 0; i < proj.sequences.numSequences; i++){
							currentSequence = proj.sequences[i]; 
							proj.openSequence(currentSequence.sequenceID);
							this.addAllClipsToMediaEncoderQueue(currentSequence);
						}
					} else{
						alert("This project doesn't contain any sequences");
					}
				} else {
					var numOn;
					if(proj.sequences.numSequences > 0){
						for(var i = 0; i < proj.sequences.numSequences; i++){
							numOn = config.numOn == true ? numOn = i : -1;
							currentSequence = proj.sequences[i]; 
							proj.openSequence(currentSequence.sequenceID);
							this.addToExportAllCurrentSequenceDuration(currentSequence,numOn);
						}
					} else{
						alert("This project doesn't contain any sequences");
					}
				}
			}
		} 
	},
	addToExportAllCurrentSequenceDuration: function(localSequence,localIteration){
		var clipIn, clipOut;
		var availableTracks = localSequence.videoTracks;
		if(localSequence){
			if(availableTracks.length > 0){
			var firstClip = availableTracks[0].clips
				if(firstClip.length > 0){
					clipIn = firstClip.start.seconds;
					clipOut = firstClip.end.seconds;

					for(var i = 0; i < availableTracks.length; i++){
					var currentTrack = availableTracks[i];
						for(var j = 0; j < currentTrack.clips.length; j++){
							var currentClip = availableTracks[i].clips[j];
							if(currentClip.start.seconds < clipIn){
								clipIn = currentClip.start.seconds;
							} if(currentClip.end.seconds > clipOut){
								clipOut = currentClip.end.seconds;
							}
						}
					}

					this.trimArea(clipIn,clipOut);
					this.addToAME(localIteration);

				} else{
					alert("sequences is empty!");
				}
			} else{
				alert("video tracks missing!");
			}			
		} else {
			alert("Specified sequence doesn't exist!");
		}
	},
	processEeachTrack: function(tracks){
		var index = 0;
		
		for(var i = 0; i<tracks.length; i++){
			var currentTrack = tracks[i];

			this.secureTracks(tracks,1);
			currentTrack.setMute(0);
			currentTrack.setLocked(0);

			for(j = 0; j<currentTrack.clips.length; j++){
				this.selectClipsAndAddToExportQueue([currentTrack.clips[j]],index++);
			}
		}
		
		this.secureTracks(tracks,0);
		return index;
	},
	selectClipsAndAddToExportQueue: function(clips,index){
		for(var i = 0; i<clips.length;i++){
			var iteration = index == null || index == undefined ? i : index;
			this.trimArea(clips[i].start.seconds,clips[i].end.seconds);
			this.addToAME(iteration);
		}
	},
	addAllClipsToMediaEncoderQueue: function(localSequence){
		var availableTracks;
		var monit;

		if(config.basedOn == "each clip" || config.basedOn == "clips on track" || config.basedOn == "selected clips"){
			monit = "Video";
			availableTracks = localSequence.videoTracks;
		} else {
			monit = "Audio";
			availableTracks = localSequence.audioTracks;
		}
		
		if(localSequence){
			if(availableTracks.length > 0){
				if(config.basedOn == "each clip" || config.basedOn == "each clip audio"){
					this.processEeachTrack(availableTracks);
				} else if(config.basedOn == "clips on track" || config.basedOn == "clip audio on track"){					
					if(config.basedOnIndex < availableTracks.length && config.basedOnIndex >= 0){
						this.secureTracks(availableTracks,1);
						var currentTrack = [availableTracks[config.basedOnIndex]];
						this.processEeachTrack(currentTrack);
						this.secureTracks(availableTracks,0);
					} else {
						alert("Track with specified index doesn't exist");
					}	
				} else if(config.basedOn == "selected clips" || config.basedOn == "selected clips audio"){
					var selectedClipsNumber = 0;
					var selectedClips = [];

					for(var i = 0; i<availableTracks.length;i++){
						var currentTrack = availableTracks[i];
						for(var j = 0; j < currentTrack.clips.length; j++){
							var currentClip = currentTrack.clips[j];
							if(currentClip.isSelected()){
								selectedClips.push(currentClip);
								selectedClipsNumber++;
							}
						}
					}
					if(!selectedClipsNumber){
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
	secureTracks: function (tracks,mode){
		if(isSecurityEnabled){
			for(var i = 0; i < tracks.length; i++){
				tracks[i].setMute(mode);
				tracks[i].setLocked(mode);
			}
		}
	},
	trimArea: function(inp,oup){
		proj.activeSequence.setOutPoint(oup);
		proj.activeSequence.setInPoint(inp);
	},
	exportingPreset: function(mode){
		var outPresetPath;

		switch(config.encodingPreset){
			case "h.264 | 64mbps | 384kbps":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\h264_64mbps_mp4_384kbps.epr");
				break;
			case "h.264 | 15mbps | 384kbps":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\h264_15mbps_mp4_384kbps.epr");
				break;
			case "h.264 | 64mbps | no audio":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\h264_64mbps_mp4_no-audio.epr");
				break;
			case "h.264 | 15mbps | no audio":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\h264_15mbps_mp4_no-audio.epr");
				break;
			case "vp9 | quality 60% | 384kbps":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\vp9_q60_webm_384kbps.epr");
				break;
			case "vp9 | quality 90% | 384kbps":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\vp9_q90_webm_384kbps.epr");
				break;
			case "vp9 | quality 60% | no audio":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\vp9_q60_webm_no-audio.epr");
				break;
			case "vp9 | quality 90% | no audio":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\vp9_q90_webm_no-audio.epr");
				break;
			case "quicktime | alpha | audio on":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\qicktime_alpha_with-audio.epr");
				break;
			case "quicktime | alpha | audio off":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\qicktime_alpha_no-audio.epr"); 
				break;
			case ".wav | umcompressed | 16 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\wav_umcompressed_16bit_stereo.epr"); 
				break;
			case ".wav | umcompressed | 24 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\wav_umcompressed_24bit_stereo.epr"); 
				break;
			case ".wav | umcompressed | 32 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\wav_umcompressed_32bit_stereo.epr"); 
				break;
			case ".mp3 |  192kbps | 16 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\mp3_192kbps_16bit_stereo.epr"); 
				break;
			case ".mp3 |  256kbps | 16 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\mp3_256kbps_16bit_stereo.epr"); 
				break;
			case ".mp3 |  320kbps | 16 bit | stereo":
				outPresetPath = newPluginPath + this.fixPath("\\presets\\mp3_320kbps_16bit_stereo.epr"); 
				break;
			
			case "custom":
				if(newCustomEncodingPresetPath != ""){
					outPresetPath = newCustomEncodingPresetPath.fsName;
				} else {
					alert("You haven't chosen any preset path");
					newCustomEncodingPresetPath = getNewPreset();
					return 0;
				}
				break;
		}

		var outPreset = new File(outPresetPath);
		var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
		if(mode == 1){
			return outPresetPath;
		} else{
			return "." + outFormExt;
		}
	},
	fileOutputPath: function(paramIterator){
		var iteration, renderFileName;
		var currentIteration = Number(paramIterator) + Number(config.namesIndexOffset);
			if(currentIteration < 0){
				iteration = "";
			} else if(currentIteration <= 9){
				iteration = "_000" + currentIteration;
			} else if(currentIteration > 9 && currentIteration <= 99){
				iteration = "_00" + currentIteration;
			} else if(currentIteration > 99 && currentIteration <= 999){
				iteration = "_0" + currentIteration;
			} else {
				iteration = "_" + currentIteration;
			}
		
		if(config.filesName != null && config.filesName != ""){
			if(config.applyFor != "current sequence" && config.applyFor != null){
			renderFileName = currentSequence.name + "_" + config.filesName + iteration; 
			} else {
			renderFileName = config.filesName + iteration;
		}
		} else {
			renderFileName = currentSequence.name + iteration;
		}
		return renderFileName;		
	},
	outputDirectoryPath: function(){
		if(outputFolderPath.fsName != null && outputFolderPath.fsName != "" && outputFolderPath.fsName != undefined){
			return outputFolderPath.fsName;
		} else {
			return app.project.path.substr(0,app.project.path.length - app.project.name.length); 
		}
	},
	loadPreset: function(path){
		var customPresetPath = this.fixPath(path) + this.fixPath("\\presets\\dynamic\\user_custom_preset.epr");
		var presetInstance = new File(customPresetPath);
		if(presetInstance.exists){
			newCustomEncodingPresetPath = presetInstance;
		} else {
			getNewPreset(path);
		}
	},
	prepareNewFolder: function(outPath){
		if(newDirectoryName != undefined && newDirectoryName != null && newDirectoryName != ""){
			var f = new Folder(outPath + this.fixPath("/") + newDirectoryName);
			if(!f.exists){
				f.create();
			} 
			return newDirectoryName + this.fixPath("/");
		} else{
			return "";
		}
	},
	fixPath: function(pathToFix){
		var newPath = pathToFix;
		if(!currentOS){
			while(newPath.indexOf("/") > 0){
				newPath = newPath.replace('/','\\');		
			}
			return newPath;
		} else {
			while(newPath.indexOf("\\") > 0){
				newPath = newPath.replace("\\","/");
			}
			return newPath;
		}
	},
	addToAME: function(nameIterator){	
		var newFileName = this.fileOutputPath(nameIterator) + this.exportingPreset();
		var outputFilePath;

		outputFilePath = this.outputDirectoryPath() + this.fixPath('\\') + this.prepareNewFolder(this.outputDirectoryPath()) + newFileName;

		var checkIfExists = new File(outputFilePath);
			if(outputFilePath.exists){
				var destroyCurrent = confirm("A file with that name already exist: Do You want to overwrite?",false,"are You sure?");
					if(destroyCurrent){
						checkIfExists.remove();
						checkIfExists.close();
					}
			}
		
		app.encoder.encodeSequence(currentSequence,outputFilePath,this.exportingPreset(1),app.encoder.ENCODE_IN_TO_OUT,0);
	},
}
function getFolderPath(){
	outputFolderPath = Folder.selectDialog("Choose the output directory");
	return outputFolderPath.fsName;
}
function getNewPreset(path){
	newCustomEncodingPresetPath = File.openDialog("Choose preset","Required: *.epr*",false);

		newCustomEncodingPresetPath.open("r");
	var backup = newCustomEncodingPresetPath.read();
		newCustomEncodingPresetPath.close();

	var dynamicPresetPath = $.runScript.fixPath(path) + $.runScript.fixPath("\\presets\\dynamic\\user_custom_preset.epr");
	var recoveryFile = new File(dynamicPresetPath);
		if(dynamicPresetPath.exists){
			recoveryFile.remove();
			recoveryFile.close();
		}
			recoveryFile.open("w");
			recoveryFile.write(backup);
			recoveryFile.close();
}
function loadConfiguration(path){
		var importConfig = new File($.runScript.fixPath(path) + $.runScript.fixPath("\\config\\config.json"));
		var result;
		if(importConfig.exists){
			importConfig.open("r");
			result = importConfig.read();
			importConfig.close();
			return result;
		} else {
			return 0;
		}
}
function setOSValue(csinfo){
	var obj = JSON.parse(csinfo);
	currentOS = csinfo.index;
}
function checkSecurityStatus(inputValue){
	var val = JSON.parse(inputValue);
	isSecurityEnabled = val.status;
}