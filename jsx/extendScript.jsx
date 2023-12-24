$.runScript = {
	AddToRenderingQueue: function() {
		var proj = app.project;
		var currentSequence = proj.activeSequence;

		if(currentSequence){
			var clipIn, clipOut;
			var availableTracks = currentSequence.videoTracks;
			
			function secureTracks(tracks,mode){
				for(var i = 0; i < tracks.length; i++){
					tracks[i].setMute(mode);
					tracks[i].setLocked(mode);
				}
			}
			function trimArea(inp,oup){
				proj.activeSequence.setOutPoint(oup);
				proj.activeSequence.setInPoint(inp);
			}
			function addToAME(nameIterator){
				var outPath = "D:\\Archiwum\\Pulpit";
				var outPresetPath = "D:\\Archiwum\\Dokumenty\\Adobe\\Adobe Media Encoder\\23.0\\Presets\\4k25p.epr";

				if(outPresetPath){
					var outPreset = new File(outPresetPath);
					var outFormExt = currentSequence.getExportFileExtension(outPreset.fsName);
					var newFileName = currentSequence.name + "." + outFormExt;
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
			var uniqueExport = 0;
			for(var i = 0; i < availableTracks.length; i++){
				secureTracks(availableTracks,1);
			
				availableTracks[i].setMute(0);
				availableTracks[i].setLocked(0);

				for(var l = 0; l < availableTracks[i].clips.length; l++){
					clipIn = availableTracks[i].clips[l].start.seconds;
					clipOut = availableTracks[i].clips[l].end.seconds;
						trimArea(clipIn,clipOut);
						addToAME(uniqueExport++);
				}
			}
			secureTracks(availableTracks,0);
		}
	},
}