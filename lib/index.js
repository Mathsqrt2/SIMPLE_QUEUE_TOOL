const processRequest = () =>{
    const functionParam = {
        type: document.getElementById('typeOfRenderingQueue').value,
        applyFor: document.getElementById('rangeOfRenderingQueue').value,
        searchPattern: document.getElementById('searchedValue').value == "" ? null : document.getElementById('searchedValue').value,
        encodingPreset: document.getElementById('encodingPreset').value == "" ? null : document.getElementById('encodingPreset').value, 
        customEncodingPresetPath: document.getElementById('customEncodingPresetPath').value == "" ? null : document.getElementById('customEncodingPresetPath').value,
        outputPath: document.getElementById('newOutputPath').value == "" ? null : document.getElementById('newOutputPath').value,
        folderName: document.getElementById('newFolderName').value == "" ? null : document.getElementById('newFolderName').value, 
        filesName: document.getElementById('newNamePattern').value == "" ? null : document.getElementById('newNamePattern').value,
    }
    let cs = new CSInterface;
        cs.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
}
const patternFieldUnlock = (event) =>{
    const selector = document.getElementById("searchedValue");
    if(event.target.value == "Current_sequence"){
        selector.disabled = true;
    } else {
        selector.disabled = false;
    }
}
const presetPathUnlock = (event) => {
    const field = document.getElementById("customEncodingPresetPath");
    const pathHolder = document.getElementById("selectPresetPath");

    if(event.target.value == "custom"){
        field.disabled = false;
        pathHolder.disabled = false;
        field.value = pathHolder.addEventListener('click',getDir);
    } else {
        field.disabled = true;
        pathHolder.disabled = true;   
    }
}
async function getDir() {
    return dirHandle = await window.showDirectoryPicker();
}
const attachBodyScripts = () =>{
const submit = document.getElementById('runButton');
      submit.addEventListener('click',processRequest);

const applyForSelector = document.getElementById("rangeOfRenderingQueue");
      applyForSelector.addEventListener('change',patternFieldUnlock)

const customPresetSelector = document.getElementById("encodingPreset");
      customPresetSelector.addEventListener('change',presetPathUnlock);     
}

addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('load',attachBodyScripts);