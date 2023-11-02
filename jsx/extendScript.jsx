$.runScript = {
	sequences: [],

	getAvailableSequences: function(){
		let choose = document.getElementById('sequenceChoose');
		let searchedValue = document.getElementById('searchedValue');
		
		if(choose.checked){
			$.runScript.sequences.push('test');
		}

	},
	RenderQueueTool: function(){
		alert("test");
	}	
}