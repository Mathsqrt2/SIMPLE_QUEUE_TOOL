$.runScript = {
	proj: app.project,
	currentSequence: proj.activeSequence,
	processRequest: function(userConfig){
		var config = JSON.parse(userConfig);
		this.addToRenderingQueue();
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
		var outPresetPath;
		if(config.encodingPreset == "h.264 | .mp4"){
			alert("tu");
			outPresetPath = "../lib/basic_vp9.epr";
		} else if (config.encodingPreset == "vp9 | .webm"){
			alert("tam");
			outPresetPath = "../lib/basic_vp9.epr";
		} else {
			alert("siam");
			outPresetPath = config.encodingPreset;
		}
		
		var outPreset = new File(outPresetPath);
		var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
		return "." + outFormExt;
	},
	fileOutputPath: function(currentIteration){
		var iteration, renderFileName;
			if(currentIteration < 9){
				iteration = "000" + currentIteration;
			} else if(currentIteration > 9 && currentIteration <= 99){
				iteration = "00" + currentIteration;
			} else if(currentIteration > 99 && currentIteration <= 999){
				iteration = "0" + currentIteration;
			} else {
				iteration = currentIteration;
			}
		
		if(config.filesName){
			renderFileName = config.filesName + "_" + iteration;
		} else {
			renderFileName = currentSequence.name + "_" + iteration;
		}
		return renderFileName;		
	},
	addToAME: function(nameIterator){
		var outPath = "D:\\Archiwum\\Pulpit";
		

		if(outPresetPath){

			var newFileName = this.fileOutputPath(nameIterator) + this.exportingPreset();
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