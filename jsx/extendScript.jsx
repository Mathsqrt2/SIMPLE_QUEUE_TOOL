$.runScript = {
	processRequest: function(userConfig){
		proj = app.project;
		config = JSON.parse(userConfig);
		currentSequence = proj.activeSequence;
		uniqueExport = config.exportsNumber;

		if(config.applyFor == "Current_sequence"){
			if(config.type == "Clips"){
				this.addAllClipsToMediaEncoderQueue(currentSequence);
			} else {
				this.addToExportAllcurrentSequenceDuration(currentSequence,-1);
			}
		} else {
			// for Multiple_sequences
			if(config.searchPattern != null){
				// if search pattern is set
				if(config.type == "Clips"){
					// for each clip in every sequence found
					proj.openSequence(currentSequence.sequenceID);
					this.addAllClipsToMediaEncoderQueue(currentSequence);					
				} else {
					
					proj.openSequence(currentSequence.sequenceID);
					this.addAllClipsToMediaEncoderQueue(currentSequence);
					// for every sequence in found pattern
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
							this.addToExportAllcurrentSequenceDuration(currentSequence,i);
						}
					} else{
						alert("This project doesn't contain any sequences");
					}
				}
			}
		}
		
		return uniqueExport;
	},
	addToExportAllcurrentSequenceDuration: function(localSequence,localIteration){
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
			outPresetPath = config.customEncodingPresetPath;
		}
		var outPreset = new File(outPresetPath);
		var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
		if(mode == 1){
			return outPresetPath;
		} else{
			return "." + outFormExt;
		}
	},
	fileOutputPath: function(currentIteration){
		var iteration, renderFileName;
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
			renderFileName = config.filesName + iteration;
		} else {
			renderFileName = currentSequence.name + iteration;
		}
		return renderFileName;		
	},
	outputDirectoryPath: function(){
		if(config.outputPath != null && config.outputPath != ""){
			return config.outputPath;
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