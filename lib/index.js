let cs = new CSInterface;

const confirmButton = document.getElementById("confirm");
const pathHolder = document.getElementById("selectPresetPathContainer");
const presetPathInput = document.getElementById("selectPresetPath");

const processRequest = () =>{

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
            numOn: document.getElementById("numOn") == "yes" ? true : false,
        }
        cs.evalScript(`$.runScript.processRequest('${JSON.stringify(functionParam)}')`);
}
const getDirectoryPath = () =>{
    cs.evalScript(`getFolderPath()`);
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
    
    if(event.target.value == "custom"){
        pathHolder.classList.remove("hidden");
        presetPathInput.disabled = false;

        confirmButton.disabled = true;
        confirmButton.classList.add("confirm-locked");

        presetPathInput.addEventListener("click",()=>{
            cs.evalScript(`getNewPreset()`);
            confirmButton.disabled = false;
            confirmButton.classList.remove("confirm-locked");
        });
    } else {
        pathHolder.classList.add("hidden");
        presetPathInput.disabled = true;  
        confirmButton.disabled = false;
        confirmButton.classList.remove("confirm-locked"); 
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
    
    document.getElementById("basedOnPropertyBox").classList.toggle("hidden");
    document.getElementById("addIndexOption").classList.toggle("hidden");

    if(event.target.value == "clips"){
        field.classList.remove("hidden");
        fieldLabel.classList.remove("hidden");
        if(field.value != "Each clip"){
            field2.classList.remove("hidden");
        }
    } else {
        field.classList.add("hidden");
        field2.classList.add("hidden");
        fieldLabel.classList.add("hidden");     
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