const processRequest = () =>{
    const functionParam = {
        type: document.getElementById("typeOfRenderingQueue").value,
        basedOn: document.getElementById("basedOn").value,
        basedOnIndex: document.getElementById("baseIndex").value == "" ? 0 : document.getElementById("baseIndex").value,
        applyFor: document.getElementById("rangeOfRenderingQueue").value,
        searchPattern: document.getElementById("searchedValue").value == "" ? null : document.getElementById("searchedValue").value,
        encodingPreset: document.getElementById("encodingPreset").value == "" ? null : document.getElementById("encodingPreset").value, 
        customEncodingPresetPath: document.getElementById("presetPathButton").value == "" ? null : document.getElementById("presetPathButton").value,
        outputPath: document.getElementById("newOutputPath").dataset.path == "" ? null : document.getElementById("newOutputPath").dataset.path,
        folderName: document.getElementById("newFolderName").value == "" ? null : document.getElementById("newFolderName").value, 
        filesName: document.getElementById("newNamePattern").value == "" ? null : document.getElementById("newNamePattern").value,
        namesIndexOffset: document.getElementById("indexOffset").value == "" ? null : document.getElementById("indexOffset").value,
        numOn: document.getElementById("numOn").checked,
    }

    let cs = new CSInterface;
        cs.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
}
const patternFieldUnlock = (event) =>{
    const selector = document.getElementById("searchedValue");
    const label = document.getElementById("searchLbl");
    const container = document.getElementById("searchContainer");

    if(event.target.value == "Current_sequence"){
        label.classList.add("hidden");
        selector.classList.add("hidden");
        container.classList.add("hidden");
        selector.disabled = true;
    } else {
        container.classList.remove("hidden");
        label.classList.remove("hidden");
        selector.classList.remove("hidden");
        selector.disabled = false;
    }
}
const presetPathUnlock = (event) => {
    const pathHolder = document.getElementById("selectPresetPath");
    const inputTypeFile = document.getElementById("presetPathButton");

    if(event.target.value == "custom"){
        pathHolder.classList.remove("hidden");
        pathHolder.disabled = false;
        pathHolder.addEventListener("click",()=>inputTypeFile.click());
    } else {
        pathHolder.classList.add("hidden");
        pathHolder.disabled = true;   
    }
}
const baseIndexUnlock = (event) =>{
    const field = document.getElementById("baseIndex");
    
    event.target.value == "Clips on track:" ? field.disabled = false : field.disabled = true;
    event.target.value == "Clips on track:" ? field.classList.remove("hidden") : field.classList.add("hidden");
}
const unlockBase = (event) => {
    const field = document.getElementById("basedOn");
    const field2 = document.getElementById("baseIndex");
    const fieldLabel = document.getElementById("fieldLabel");
    
    document.getElementById("basedOnContainer").classList.toggle("hidden");
    document.getElementById("numOn").classList.toggle("hidden");
    document.getElementById("numOnLabel").classList.toggle("hidden");


    if(event.target.value == "Clips"){
        field.classList.remove("hidden");
        fieldLabel.classList.remove("hidden");
        field.disabled = false;
        if(field.value != "Each clip"){
            field2.disabled = false;
            field2.classList.remove("hidden");
        }
    } else {
        field.disabled = true;
        field.classList.add("hidden");
        field2.disabled = true;
        field2.classList.add("hidden");
        fieldLabel.classList.add("hidden");     
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