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
            cs.evalScript(`getNewPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
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

    document.getElementById("addIndexOption").classList.toggle("hidden");

    if(event.target.value == "clips"){
        
        field.classList.remove("hidden");
        if(fieldSelect.value == "clips on track"){
            field2.classList.remove("hidden");
        }
    } else {
        field.classList.add("hidden");
        field2.classList.add("hidden");
    }
}
const setOutputDirectory = (event) =>{
    getDirectoryPath();
    event.target.value = "change directory";
}
function loadValues(){
    cs.evalScript(`loadConfiguration('${cs.getSystemPath(SystemPath.EXTENSION)}')`,function(res){
        if(res){       
        const renderType = document.getElementById("typeOfRenderingQueue");
        const numOn = document.getElementById("numOn");
        const basedOn = document.getElementById("basedOn");
        const baseIndex = document.getElementById("baseIndex");
        const renderRange = document.getElementById("rangeOfRenderingQueue");
        const pattern = document.getElementById("searchedValue");
        const patternBox = document.getElementById("searchContainer");
        const preset = document.getElementById("encodingPreset");
        const newFolderName = document.getElementById("newFolderName");
        const outputName = document.getElementById("newNamePattern");
        const indexOffset = document.getElementById("indexOffset");
        
        let config = JSON.parse(res);

        if(config.type == "sequences"){
            renderType.value = renderType.options[1].value;
            document.getElementById("addIndexOption").classList.toggle("hidden");
            document.getElementById("basedOnPropertyBox").classList.add("hidden");

            if(config.numOn == true){
                numOn.value = numOn.options[0].value;
            } else {
                numOn.value = numOn.options[1].value;
            }

        } 
        switch(config.basedOn){
            case "each clip":
                basedOn.value = basedOn.options[0].value;
                break;
            case "clips on track":
                basedOn.value = basedOn.options[1].value;
                document.getElementById("baseIndexContainer").classList.remove("hidden");
                baseIndex.value = config.basedOnIndex;
                break;
        }
        switch(config.applyFor){
            case "current sequence":
                renderRange.value = renderRange.options[0].value;
                break;
            case "multiple sequences":
                renderRange.value = renderRange.options[1].value;
                patternBox.classList.remove("hidden");
                    if(config.searchPattern){
                        pattern.value = config.searchPattern;
                    }
                break;
        }
        switch(config.encodingPreset){
            case "h.264 | 64mbps | 384kbps":
                preset.value = encodingPreset.options[0].value;
                break;
            case "h.264 | 15mbps | 384kbps":
                preset.value = encodingPreset.options[1].value;
                break;
            case "h.264 | 64mbps | no audio":
                preset.value = encodingPreset.options[2].value;
                break;
            case "h.264 | 15mbps | no audio":
                preset.value = encodingPreset.options[3].value;
                break;
            case "vp9 | quality 60% | 384kbps":
                preset.value = encodingPreset.options[4].value;
                break;
            case "vp9 | quality 90% | 384kbps":
                preset.value = encodingPreset.options[5].value;
                break;
            case "vp9 | quality 60% | no audio":
                preset.value = encodingPreset.options[6].value;
                break;
            case "vp9 | quality 90% | no audio":
                preset.value = encodingPreset.options[7].value;
                break;
            case "quicktime | alpha | audio on":
                preset.value = encodingPreset.options[8].value;
                break;
            case "quicktime | alpha | audio off":
                preset.value = encodingPreset.options[9].value;
                break;
            case "custom":
                preset.value = encodingPreset.options[10].value;
                document.getElementById("selectPresetPathContainer").classList.remove("hidden");
                document.getElementById("selectPresetPath").addEventListener("click",()=>{
                    cs.evalScript(`getNewPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                });
                cs.evalScript(`$.runScript.loadPreset('${cs.getSystemPath(SystemPath.EXTENSION)}')`);
                break;
        }
        if(config.folderName){
            newFolderName.value = config.folderName;
        }
        if(config.filesName){
            outputName.value = config.filesName;
        }
        if(config.namesIndexOffset){
            indexOffset.value = config.namesIndexOffset;
        }
        }
    });
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
addEventListener("load",loadValues);