import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
const port = 3030;

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

/**
 * Welcome msg on home page
 */
app.get('/', (req, res) => {
    res.send('fileren-remoteapi-example is running');
});

/**
 * Interface for the objects received from Fileren
 */
interface FilerenFiles {
    filename: string;
    folderpath: string;
    baseFolderpath: string;
    childFolder: string;
    ext: string;
    sep: string;
    filesize: number;
    creationTimestamp: number;
    modificationTimestamp: number;
}

/**
 * Interface to send back to Fileren
 */
interface FilerenProcessed {
    filename: string;
    ext: string;
    folderpath: string;
}

/**
 * This endpoint will rename all files to this pattern:
 * Photos_(index)_(date with year-month-date)
 * it will keep the file extension
 * index will start from 001
 * date will be the creation date of each file
 */
app.post('/renamePhotos', (req, res) => {
    if (req.body && Array.isArray(req.body)) {
        const files: FilerenFiles[] = req.body;
        const processedFiles: FilerenProcessed[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const date = new Date(file.creationTimestamp);
            const newValues: FilerenProcessed = {
                filename: 'Photos_' + padLeadingZeros(i+1, 3) + '_' + date.toJSON().slice(0, 10),
                ext: file.ext,
                folderpath: file.folderpath,
            };
            processedFiles.push(newValues);
        }
        res.json(processedFiles);
    } else {
        res.json([]);
    }
});

/**
 * Adds 0 prefix in front of numbers
 * @param num the number
 * @param size the character length of the result string
 * @returns result string
 */
function padLeadingZeros(num: number, size: number) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * Start the express server on the defined port
 */
app.listen(port, () => {
    console.log('Listening at: http://localhost:' + port);
}).on('error', (e) => {
    console.log('Error happened: ', e.message);
});