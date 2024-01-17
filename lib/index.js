let cs = new CSInterface;

const processRequest = () =>{
const confirmButton = document.getElementById("confirm");
if(!confirmButton.classList.contains("confirm-locked")){
        const functionParam = {
            type: document.getElementById("typeOfRenderingQueue").value,
            basedOn: document.getElementById("basedOn").value,
            basedOnIndex: document.getElementById("baseIndex").value == "" ? 0 : document.getElementById("baseIndex").value,
            applyFor: document.getElementById("rangeOfRenderingQueue").value,
            pluginPath: cs.getSystemPath(SystemPath.EXTENSION),
            searchPattern: document.getElementById("searchedValue").value == "" ? null : document.getElementById("searchedValue").value,
            encodingPreset: document.getElementById("encodingPreset").value == "" ? null : document.getElementById("encodingPreset").value, 
            folderName: document.getElementById("newFolderName").value == "" ? null : document.getElementById("newFolderName").value, 
            filesName: document.getElementById("newNamePattern").value == "" ? null : document.getElementById("newNamePattern").value,
            namesIndexOffset: document.getElementById("indexOffset").value == "" ? null : document.getElementById("indexOffset").value,
            numOn: document.getElementById("numOn").value == "yes" ? true : false,
        }
        cs.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
    }
}
const getDirectoryPath = () =>{
    cs.evalScript(`getFolderPath()`);
}
const patternFieldUnlock = (event) =>{
const field = document.getElementById("searchContainer");
event.target.value == "multiple sequences" ? field.classList.remove("hidden") : field.classList.add("hidden");
}
const presetPathUnlock = (event) => {
    const confirmButton = document.getElementById("confirm");
    const pathHolder = document.getElementById("selectPresetPathContainer");
    const presetPathInput = document.getElementById("selectPresetPath");

    if(event.target.value == "custom"){
        pathHolder.classList.remove("hidden");
        confirmButton.classList.add("confirm-locked");

        presetPathInput.addEventListener("click",()=>{
            cs.evalScript(`getNewPreset()`);
            confirmButton.classList.remove("confirm-locked");
        },false);
    } else {
        pathHolder.classList.add("hidden"); 
        confirmButton.classList.remove("confirm-locked"); 
    }
}
const baseIndexUnlock = (event) =>{
    const field = document.getElementById("baseIndexContainer");
    event.target.value == "clips on track" ? field.classList.remove("hidden") : field.classList.add("hidden");
}
const unlockBase = (event) => {
    const field = document.getElementById("basedOnPropertyBox");
    const field2 = document.getElementById("baseIndexContainer");
    const fieldSelect = document.getElementById("basedOn");
    const bonusOption = document.getElementById("selectedSequences");
    const renderingRange = document.getElementById("rangeOfRenderingQueue");
    const search = document.getElementById("searchContainer");

    document.getElementById("addIndexOption").classList.toggle("hidden");

    if(event.target.value == "clips"){
        bonusOption.classList.add("hidden");
        if(bonusOption.value == "selected sequences"){
            renderingRange.value = renderingRange.options[0].value;
            search.classList.add("hidden");
        }
        field.classList.remove("hidden");
        if(fieldSelect.value == "clips on track"){
            field2.classList.remove("hidden");
        }
    } else {
        field.classList.add("hidden");
        field2.classList.add("hidden");
        bonusOption.classList.remove("hidden");
    }
}
const setOutputDirectory = (event) =>{
    getDirectoryPath();
    event.target.value = "change directory";
}
const attachBodyScripts = () =>{
document.getElementById("typeOfRenderingQueue").addEventListener("change",unlockBase)
document.getElementById("confirm").addEventListener("click",processRequest);
document.getElementById("rangeOfRenderingQueue").addEventListener("change",patternFieldUnlock);
document.getElementById("encodingPreset").addEventListener("change",presetPathUnlock);
document.getElementById("basedOn").addEventListener("change",baseIndexUnlock);
document.getElementById("newOutputPath").addEventListener("click",setOutputDirectory);
}

addEventListener("contextmenu",e=>e.preventDefault());
addEventListener("load",attachBodyScripts);