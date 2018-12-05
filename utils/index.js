function objArrayToSinglePropertyArray(objArray,property){
    let arr=[];
    for(var i in objArray){
        arr.push(objArray[i][property]);
    }
    return arr;
}
function isValueExistInArray(arr,value){
    for(var i in arr){
        if(arr[i]==value){
            return true;
        }
    }
    return false;
}

function removeElement(arr,value){
    for(var i in arr){
        if(arr[i]==value){
            arr.splice(i,1);
            return arr;
        }
    }
    return arr;
}
exports.isValueExistInArray=isValueExistInArray;
exports.objArrayToSinglePropertyArray=objArrayToSinglePropertyArray;
exports.removeElement=removeElement;