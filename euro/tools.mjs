import { readdirSync, statSync, unlinkSync } from 'fs';


const removeOldFile = function(dirPath) {
    try {
        var files = readdirSync(dirPath);
    } catch (e) {
        console.log('errro when delete files');
        console.log(e)
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {

            var eccn = /^([0-9][A-E]\d{3})|(EAR99)\b/.exec(files[i]);
            var filePath = dirPath + '/' + files[i];
            if (eccn != null && statSync(filePath).isFile()) {
                unlinkSync(filePath);
            } else {
                console.log('not deleting', files[i]);
            }
        }
}

export {
    removeOldFile
};