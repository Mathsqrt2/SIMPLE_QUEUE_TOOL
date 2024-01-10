const processRequest = () =>{
    const functionParam = {
        type: document.getElementById("typeOfRenderingQueue").value,
        basedOn: document.getElementById("basedOn").value,
        basedOnIndex: document.getElementById("baseIndex").value,
        applyFor: document.getElementById("rangeOfRenderingQueue").value,
        searchPattern: document.getElementById("searchedValue").value == "" ? null : document.getElementById("searchedValue").value,
        encodingPreset: document.getElementById("encodingPreset").value == "" ? null : document.getElementById("encodingPreset").value, 
        customEncodingPresetPath: document.getElementById("presetPathButton").value == "" ? null : document.getElementById("presetPathButton").value,
        outputPath: document.getElementById("newOutputPath").dataset.path == "" ? null : document.getElementById("newOutputPath").dataset.path,
        folderName: document.getElementById("newFolderName").value == "" ? null : document.getElementById("newFolderName").value, 
        filesName: document.getElementById("newNamePattern").value == "" ? null : document.getElementById("newNamePattern").value,
        namesIndexOffset: document.getElementById("indexOffset").value == "" ? null : document.getElementById("indexOffset").value,
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
    const pathHolder = document.getElementById("selectPresetPath");
    const inputTypeFile = document.getElementById("presetPathButton");

    if(event.target.value == "custom"){
        pathHolder.disabled = false;
        pathHolder.addEventListener("click",()=>inputTypeFile.click());
    } else {
        pathHolder.disabled = true;   
    }
}
const baseIndexUnlock = (event) =>{
    const field = document.getElementById("baseIndex");
    event.target.value == "Clips on track:" ? field.disabled = false : field.disabled = true;    
}
const unlockBase = (event) => {
    const field = document.getElementById("basedOn");
    const field2 = document.getElementById("baseIndex");
    if(event.target.value == "Clips"){
        field.disabled = false;
        if(field.value != "Each clip"){
            field2.disabled = false;
        }
    } else {
        field.disabled = true;
        field2.disabled = true;
    }
}
async function getDir() {
    return  dirHandle = await window.showDirectoryPicker();
}
const setOutputDirectory = (event) =>{
    const applyingTarget = document.getElementById("newOutputPath");
    applyingTarget.dataset.path = getDir();
    event.target.value = "change directory";
}
const attachBodyScripts = () =>{
document.getElementById("typeOfRenderingQueue").addEventListener("change",unlockBase)
document.getElementById("runButton").addEventListener("click",processRequest);
document.getElementById("rangeOfRenderingQueue").addEventListener("change",patternFieldUnlock);
document.getElementById("encodingPreset").addEventListener("change",presetPathUnlock);
document.getElementById("basedOn").addEventListener("change",baseIndexUnlock);
document.getElementById("newOutputPath").addEventListener("click",setOutputDirectory);
}

addEventListener("contextmenu",e=>e.preventDefault());
addEventListener("load",attachBodyScripts);