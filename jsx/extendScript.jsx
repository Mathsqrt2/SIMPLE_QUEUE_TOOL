$.runScript = {
	processRequest: function(userConfig){
		config = JSON.parse(userConfig);
	
		var proj = app.project;
		var currentSequence = proj.activeSequence;
	},
	addToRenderingQueue: function() {
		if(currentSequence){
			var clipIn, clipOut;
			var availableTracks = currentSequence.videoTracks;
			
			var uniqueExport = 0;
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
	exportingPreset: function(){

	},
	fileOutputPath: function(){

	},
	addToAME: function(nameIterator){
		var outPath = "D:\\Archiwum\\Pulpit";
		var outPresetPath = "D:\\Archiwum\\Dokumenty\\Adobe\\Adobe Media Encoder\\23.0\\Presets\\4k25p.epr";

		if(outPresetPath){
			var outPreset = new File(outPresetPath);
			var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
			var newFileName = currentSequence.name + "_" + nameIterator + "." + outFormExt;
			var outputFilePath = outPath + '\\' + newFileName;

			var checkIfExists = new File(outputFilePath);
				if(outputFilePath.exists){
					var destroyCurrent = confirm("A file with that name already exist: Do You want to overwrite?",false,"are You sure?");
						if(destroyCurrent){
							checkIfExists.remove();
							checkIfExists.close();
						}
				}

			app.encoder.encodeSequence(currentSequence,outputFilePath,presetPath,app.encoder.ENCODE_IN_TO_OUT,0);
		}
	}
}