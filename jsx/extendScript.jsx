var outputFolderPath = "";
var newCustomEncodingPresetPath = "";
$.runScript = {
	processRequest: function(userConfig){
		proj = app.project;
		config = JSON.parse(userConfig);
		currentSequence = proj.activeSequence;

		if(config.applyFor == "Current_sequence"){
			if(config.type == "Clips"){
				this.addAllClipsToMediaEncoderQueue(currentSequence);
			} else {
				this.addToExportAllCurrentSequenceDuration(currentSequence,-1);
			}
		} else {
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

					if(config.type == "Clips"){
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
				if(config.type == "Clips"){
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
				if(availableTracks[0].clips.length > 0){
					clipIn = availableTracks[0].clips[0].start.seconds;
					clipOut = availableTracks[0].clips[0].end.seconds;

					for(var i = 0; i < availableTracks.length; i++){
						for(var j = 0; j < availableTracks[i].clips.length; j++){
							if(availableTracks[i].clips[j].start.seconds < clipIn){
								clipIn = availableTracks[i].clips[j].start.seconds;
							} if(availableTracks[i].clips[j].end.seconds > clipOut){
								clipOut = availableTracks[i].clips[j].end.seconds;
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
	addAllClipsToMediaEncoderQueue: function(localSequence){
		
		var clipIn, clipOut;
		var availableTracks = localSequence.videoTracks;
		var uniqueExport = 0;

		if(localSequence){
			if(availableTracks.length > 0){
				if(config.basedOn == "Each clip"){
						for(var i = 0; i < availableTracks.length; i++){
							this.secureTracks(availableTracks,1);
						
							availableTracks[i].setMute(0);
							availableTracks[i].setLocked(0);
			
							for(var l = 0; l < availableTracks[i].clips.length; l++){
								clipIn = availableTracks[i].clips[l].start.seconds;
								clipOut = availableTracks[i].clips[l].end.seconds;
								this.trimArea(clipIn,clipOut);
								this.addToAME(uniqueExport++);
							}
						}
						this.secureTracks(availableTracks,0);
				} else {
					if(config.basedOnIndex < availableTracks.length){
						this.secureTracks(availableTracks,0);
						for(var i = 0; i < availableTracks[config.basedOnIndex].clips.length; i++){
							clipIn = availableTracks[config.basedOnIndex].clips[i].start.seconds;
							clipOut = availableTracks[config.basedOnIndex].clips[i].end.seconds;
							this.trimArea(clipIn,clipOut);
							this.addToAME(uniqueExport++);
						}
					} else {
						alert("track with specified index doesn't exist");
					}	
				}
			} else {
				alert("video tracks missing!")
			}
		} else {
			alert("Specified sequence doesn't exists!");
		}
	},
	secureTracks: function (tracks,mode){
		for(var i = 0; i < tracks.length; i++){
			tracks[i].setMute(mode);
			tracks[i].setLocked(mode);
		}
	},
	trimArea: function(inp,oup){
		proj.activeSequence.setOutPoint(oup);
		proj.activeSequence.setInPoint(inp);
	},
	exportingPreset: function(mode){
		var outPresetPath;
		if(config.encodingPreset == "h.264 | .mp4"){
			outPresetPath = "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\simpleRenderQueue\\lib\\basic_h264.epr";
		} else if (config.encodingPreset == "vp9 | .webm"){
			outPresetPath = "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\simpleRenderQueue\\lib\\basic_vp9.epr";
		} else {
			if(newCustomEncodingPresetPath != ""){
			outPresetPath = newCustomEncodingPresetPath.fsName;
			} else {
				alert("You haven't chosen any preset path")
			}

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
			if(config.applyFor != "Current_sequence" && config.applyFor != null){
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
		if(outputFolderPath != null && outputFolderPath != "" && outputFolderPath != undefined){
			return outputFolderPath.fsName;
		} else {
			return app.project.path.substr(0,app.project.path.length - app.project.name.length); 
		}
	},
	addToAME: function(nameIterator){		
			var newFileName = this.fileOutputPath(nameIterator) + this.exportingPreset();
			var outputFilePath = this.outputDirectoryPath() + '\\' + newFileName;

			var checkIfExists = new File(outputFilePath);
				if(outputFilePath.exists){
					var destroyCurrent = confirm("A file with that name already exist: Do You want to overwrite?",false,"are You sure?");
						if(destroyCurrent){
							checkIfExists.remove();
							checkIfExists.close();
						}
				}
			app.encoder.encodeSequence(currentSequence,outputFilePath,this.exportingPreset(1),app.encoder.ENCODE_IN_TO_OUT,0);
	}
}
function getFolderPath(){
	outputFolderPath = Folder.selectDialog("choose the output directory");
}
function getNewPreset(){
	newCustomEncodingPresetPath = File.openDialog("choose file");
}
