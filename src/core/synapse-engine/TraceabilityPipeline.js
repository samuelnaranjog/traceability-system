// @trace REQ-020 ADR-006 ADR-009 @

import path from 'node:path';
import fs, { Dirent, readFileSync } from "node:fs";
import { readdirSync, writeFileSync } from 'node:fs';

import matter from "gray-matter";

// AST
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';

// Built Methods
import { findWorkTreePath } from '../git-tree-workflow/GitWorkflowOperations';
import LinkType from '../utils/ResolveLinkType';


class DuplicateArtifact extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateArtifact";
    }
}

class MultiClassification extends Error{
    constructor(message){
        super(message);
        this.name = "MultiClassification"
    }
}

// DATA STRUCTURE PURPOSE: Stores directories (temporarely for scanning) and the complete collection of files 
/**
 * @typedef {object} innerItem
 * @property {string} name - Only the name of the file
 * @property {string} path - Only the path to the parent folder
 *  
 */

/**
 * @typedef {object} DirectoryAndFileMap
 * @property {innerItem[]} files
 * @property {innerItem[]} dirs
 */

// DATA STRUCTURE PURPOSE: Stores a valid Artifact and the files that mention it
/**
* 1. Internal content structure
* @typedef {Object} TraceableFile
* @property {string} name - Name of the file
* @property {string} path - Complete path including the file name
*/

/**
* 2. Master Object
* @typedef {Record<string, TraceableFile[]>} ArtifactRelatedFileConnection - Key is artifact with number e.g: "REQ-000", "ADR-000"
*/

/**
 * Stores the artifact identifier and number
 * @typedef {string} artifactName
 */

// REGEX LOGIC STRUCTURES
/**
 * @typedef {RegExp} regexExtractor 
 */

// CLASSIFICATION STRUCTURE
/**
 * @typedef {string} identifier - Can be an artifact identifier or a file extension
 */

/**
 * @typedef {Record<string, identifier[]>} classificationGuidelines
 */

// CLASSIFICATION STORAGE

/**
 * @typedef {Record<string, TraceableFile[]>} classifyData
 */
 

// STRUCTURES TO HOLD LINKS CLASSIFICATION 
  /**
     * @typedef {object} dataLink
     * @property {string} link - The url of the file
     * @property {string} linkName - The defined name by the user for the link or fallback "Unnamed Link"
     * @property {boolean} isHand -  'true' if the the link is hand written, 'false' otherwise
     * 
     */

const FALLBACK_LINK_NAME = 'Unnamed Link';

    /**  @typedef {Map<classification, dataLink[]>}  mapOfClassifiedLinks*/

    /** @typedef {Map<classification, link[]>} linkTypeMap */ 

    /**
     * @typedef {object} classificationAndLinkData 
     * @property {string} classification - Where does the link belongs
     * @property {string} linkName - The defined name by the user for the link or fallback "Unnamed Link"
    */
    /** @typedef {Map<link, classificationAndLinkData>} fileLinksMap */

export default class TraceabilityPipeline{

    

    /**
     * Finds the file where your algorithm will need to write the Artifact connections 
     * @param {artifactName} artifact - The artifact fo find with the algorithm
     * @param {innerItem[]} files - An array of project files
     * @param {regexExtractor} titleArtifactIdentifierReg - The expression to select the artifact from the title e.g: From TSO-ADR-000 the regex will select ADR
     * @param {regexExtractor} titleFileNameReg - The expression to select name given to the file
     * @returns {string} Valid path not repeated artifact 
     */
    static findArtifactFile(artifact, files, titleArtifactIdentifierReg, titleFileNameReg) {


        try {
            const validArtifactPath = new Set(); // Stores the valid path but serves as system inconsistency validation

            /**
         * Loop in context:
         * The loop takes the key of the Artifact identifier that has connection mentions.
         * Then it compares it with the whole file list
         * If it finds a match and its not a Analytical breakdown artifact, 
         * then the path of the artifact can be extracted to write in it the **connections**
         */
            files.forEach(file => {

                // Select Name and file title artifact with numbers
                const artifactInTitle = file.name.match(titleArtifactIdentifierReg) ?.[0];
                const fileNameInTitle = file.name.match(titleFileNameReg) ?.[0];


                /**
                 * Condition in context:
                 * - Checks if and artifact identifier is found in the title
                 * - Validates if there is contextual name in the title, if so it check if is analytical breakdown, is true well not valid artifact file skip current.
                 * - Checks what is the file of the Accepted Artifact stored identifier
                 */
                if (artifactInTitle) {
                    if (artifactInTitle && fileNameInTitle == "Analytical_Breakdown") return; // Skips the current file
                    if (artifact == artifactInTitle && (fileNameInTitle !== "Analytical_Breakdown")) {
                        //Build a valid system resistant path
                        const resolvedPath = path.join(file.path, file.name)
                        validArtifactPath.add(resolvedPath)
                    }
                }

            })

            //Check the docs don't have repeated artifacts
            if(validArtifactPath.size > 1){
                throw new DuplicateArtifact(`The next is a location or locations where ${artifact} is duplicated: ${JSON.stringify([...validArtifactPath])}`);
            }

            //Valid Path extracted
            return validArtifactPath.values().next().value; // uses set extraction of value protocol
        }
        catch (error) {
            console.error("Critical error detected in pipeline! Pipeline halted to protect vault data integrity.");
            throw error; // Stop the script, to ensure the builder fixes the duplicate files
        }

    }
    /**
     * @param {ArtifactRelatedFileConnection | TraceableFile[]} connectedFilesInput - The source data, a raw array of traceable files comming for a specific artifact key connections.
     * @param {classificationGuidelines} guidelines
     * @param {regexExtractor} fileArtifactIdentifierReg - Selects only the artifact e.g: ("PRO-REQ-001" will extract "REQ")
     * @param {regexExtractor} fileExtensionExtractionReg - Selects only the extension after the "."  e.g: ("myFile.test.js" will extract "test.js")
     * @param {string[]} systemArtifacts - Valid system artifacts list
     * @returns {classifyData} - Object with classification
     */

    static classifyArtifactConnections(connectedFilesInput, guidelines, fileArtifactIdentifierReg, fileExtensionExtractionReg, systemArtifacts){

        const currentClasification = {
            "📕 Architecture": [],
            "📓 Requirements": [],
            "🧪 Prototypes": [],
            "⚙️ Core Logic (Backend/Systems)": [],
            "🎨 Client Layer (Frontend/UI)": [],
            "🛡️ Verification (Tests & Config)": [],
            "📂 Other": [],
          };

        /**
        * Logic for files classification:
        * - Loop over the stored connections of the specific Artifact identifier.
        * - Check if the current iteration is included in the accepted artifacts
        * - Compare it with the logic that classifies based on artifact identifier. 
        * - If not, check if the extension of the file is in one of the elements.
        * - If not, add to the others section.
        */

        connectedFilesInput.forEach(file => {

            /**
             * @type {TraceableFile} file
             */

            const artifactIdentfier = file.name.match(fileArtifactIdentifierReg)?.[0]; 
            const extension = file.name.match(fileExtensionExtractionReg)?.[0]; // ?: checks if the value exist else return undefined .[0] extracts the value


            /**
             * @type {Set<string>} classification
             */
            const classification = new Set(); //Store the current classification
            

            // Notice: The string added to classification must match the currentClasification clasifications keys

            if(artifactIdentfier && systemArtifacts.includes(artifactIdentfier)){
                if(guidelines.Architecture.includes(artifactIdentfier)) classification.add('📕 Architecture');
                if(guidelines.Requirements.includes(artifactIdentfier)) classification.add('📓 Requirements');
                if(guidelines.Prototypes.includes(artifactIdentfier/*Should be changed to custom regex for proto*/ ))classification.add("🧪 Prototypes");
            }
             
            // Defining logic base on extension
            if(extension){
                if(guidelines.Core.includes(extension)) classification.add('⚙️ Core Logic (Backend/Systems)') ;
                if(guidelines.Client.includes(extension)) classification.add('🎨 Client Layer (Frontend/UI)');
                if(guidelines.Verification.includes(extension)) classification.add('🛡️ Verification (Tests & Config)');
            }

            // Defining if should be clasifying as other  
            if(classification.size === 0){
                classification.add("📂 Other");
            }

            console.log(`DEBUG: Checking if clasification works \n - file: ${file.name} \n classification: ${[...classification]}`);
            

            // Store the classify file to the proper property
            try{

              if(classification.size > 1){
                throw new MultiClassification(`The algoritm logic is selecting more than one category for the related file: ${file.name} \n This are the classifications:: ${[...classification]}`)
              }
              
              const singleCategory = [...classification][0];
              currentClasification[singleCategory].push(file);
            }
            catch(error){
              console.error('Categorization critical identification uncapability');
              throw error;
            }

        })

        return currentClasification;
    }

    /**
     * @param {Boolean} activateHeader - Activates the header for the connection section
     * @param {classifyData} categorizedData - An object with the table **areas** and respective files classified in that area
     * @param {string} artifactPath - The path of the artifact where connections are being categorized
     * @param {regexExtractor} fileAvoidExtensionReg - Selects only the name avoiding any data  after the "."  e.g: ("myFile.js" will avoid ".js")
     * @returns {string} - String with the text that creates a markdown table when render by a markdown enginee
     */

    static buildMarkdownConnectionTable(activateHeader, categorizedData, artifactPath, fileAvoidExtensionReg) {

        /**
        * Documentation for markdown rendering logic:
        * - Define the header.
        * - Build a table dynamically based on the key and the values of the currentClasification object.
        * - Avoid adding table rows for empty type categories.
        * - Select the file name without extension to use as the link display name.
        * - Add the path as the link destination.
        */

        const dynamicTableHeader = '| Type | Route |\n| :--- | :--- |\n'; //How should the header look like

        let dynamicTable = '<span hidden data-connections-begin></span>\n\n'; // Adds the token delimeter before the table 'span hidden'

        dynamicTable += dynamicTableHeader; // Starts the table with the specified table header

        for (const [key, arrayOfObjects] of Object.entries(categorizedData)) {
            /**
            * @type {string} key - Is the category on which a collection of traceableFiles[] are clasified
            * @type {TraceableFile[]} arrayOfObjects
            */

            if (Array.isArray(arrayOfObjects) && arrayOfObjects.length === 0) continue; // Skips empty connections in classification categories
            const type = `|**${key}**|`;
            dynamicTable += type;


            arrayOfObjects.forEach(fileObj => {
                /**
                 * @type {TraceableFile} fileObj
                 */
                // Find the relative path from artifact to the connected file
                const artifactDir = path.dirname(artifactPath)
                const relativeFilePath = path.relative(artifactDir, fileObj.path);

                const nameWithoutExtension = fileObj.name.match(fileAvoidExtensionReg)?.[0];

                if (nameWithoutExtension) {
                    dynamicTable += `[${nameWithoutExtension}](${relativeFilePath}) <br>`;
                }


            })

            dynamicTable += "|\n"; // Finish the row

        }

        dynamicTable += '\n<span hidden data-connections-end></span>' // After the table is finish  adds the token delimiter after the table 



        // Handles REQ & VS connections write

        if (activateHeader == true) {
            const sectionHeader = '## Connections\n';
            return sectionHeader + dynamicTable
        }
        else { // Handles ADR connections 

            /**
             * Make the table part of quoteblock
             */

            //console.log('DEBUG: table before quote block:', dynamicTable) //Table before quote block 

            const lineBeginReg = /^/gm;
            dynamicTable = dynamicTable.replace(lineBeginReg, "> ");

            //console.log('DEBUG: Table after quote block:', dynamicTable)//Table after quote block 
            return dynamicTable
        }
    } 

    /**
     * @param {artifactName} artifact - The artifact to write to identify its type
     * @param {string} artifactPath - The path of the artifact to write the connections
     * @param {string} markdownData - The data that should be inserted in the file
     * @returns {string} updatedFile - The file with its previous content and the updated data, helpful data logic testing
     */
    static writeConnectionsToArtifact(artifact, artifactPath, markdownData){
        // Should place path -> validArtifactPath but i will hardcode it to ensure no data is lost

        console.log("DEBUG: Receiving artifact:", artifact);

        const artifactData = fs.readFileSync(artifactPath, 'utf8'); // Extract artifact data to define where to plug

        const afterYAML = ['REQ', 'VS']//What artifact to insert data after YAML
        const specificSection = ['ADR'] //What artifact to insert data in specific connection variation section

        /**
         * Divides the YAML data from the content using gray-matter, once extracted to a varible the parsed data:
         * - use `.content` to access its content
         * - use `.data` to put together all the properties of the yaml 
         * - use .stringify to build all the data including the YAML back on top.
         */
        const parsedData = matter(artifactData); 

        if(afterYAML.includes(artifact)){

            if(parsedData.content.includes('## Connections\n')){
                // Since the markdown data already contains the header replace the data from the header

                const fileWithHeaderReg = /## Connections\s*<span hidden data-connections-begin><\/span>[\s\S]*?(<span hidden data-connections-end><\/span>)/i;
                parsedData.content = parsedData.content.replace(fileWithHeaderReg, `${markdownData}`)
            }

            //First time connections data appending
            if(!(parsedData.content.includes('## Connections\n'))){
                parsedData.content = markdownData + parsedData.content; // Adding the markdown data on top without replacing
            }

            //console.log("DEBUG: Checking what is being build when the file is clean VS or REQ:", parsedData.content ) - Temp debug log

        }   

        if(specificSection.includes(artifact)){
            /**
             * Custom data insertion within specific section:
             * - .replace() with
             * Add back the specific keyword + the content to be added, replacing the other content
             */
            const fileFindSectionReg = /(>\s*\*Connections\*[\s\S]*?)<span\s+hidden\s+data-connections-begin><\/span>[\s\S]*?>?\s*<span\s+hidden\s+data-connections-end><\/span>/i;
            parsedData.content = parsedData.content.replace(fileFindSectionReg, `$1${markdownData}`)
            
            //console.log("DEBUG: Checking what is being extracted", parsedData.content )
        }

        // Update the file data
        const updatedFile = matter.stringify(parsedData.content, parsedData.data ) //Stringify puts properties and content back together

        // Rewrite the file with the new content
        try{
            fs.writeFileSync(artifactPath, updatedFile, { flag: 'r+' } ); //Temporary disable
            return updatedFile;
        }
        catch(error){
            if (error.code === 'ENOENT') {
            console.warn(`File with path ${artifactPath} not found. Skipping write operation...`);
        }

        
        
    }}


    /**
     * 
     * @param {string} artifacFilePath - Absolute path to the artifact to scan
     * @returns {object} The parsed AST object
     */ 
    static parseAST(artifacFilePath){
        const fileProccesor = unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        

        let artifactData;
        try {
            artifactData = readFileSync(artifacFilePath, "utf8");
        } catch (error) {
            console.error(`Fail to access the file ${artifacFilePath}`, error);
        }

        let fileASTData;
        try {
            fileASTData = fileProccesor.parse(artifactData);
        } catch (error) {
            console.error(`Fail to Parse to AST the artifact file`, error.message);
            process.exit(1)
        }
        return fileASTData;
    }

    /**
     * 
     * @param {string} artifactFilePath 
     * @param {string} link 
     * @returns {string} If it was file link returns absolute path. If it was hand type returns unmodified link
     */
    static evaluateLinkRoute(artifactFilePath, link){
        
        try{
        if(!LinkType.bypassFileSystem(link)){
            //Handle the absolute path formating
            //Extract just the folder where the artifact lives
            const artifactFolder = path.dirname(artifactFilePath); 
            

            // Resolve the relative link against that folder
            const absoluteSystemPath = path.resolve(artifactFolder, link);
            return absoluteSystemPath;

        }else{
            return link
        }
    }
    catch(error){
        console.error('Fail to determine if links was relative path or hadn written:', error)
    }

        
    }


    /**
     * @description Extract the file link from a file "# connections" section table 
     * @description Build a data structure, adding {Map<link, classification>}
     * @param {string} artifactFilePath - Absolute path to the artifact to scan
     * @returns {fileLinksMap} A data structure that map links and its type
     */
    static buildFileLinks(artifactFilePath) {
        
        console.log(`DEBUG: Running buildFileLinks!!!. `) //uncoment to debug 

        

        try {

            // My map structure of type
            /** @type  {fileLinksMap} */
            const fileLinksMap = new Map();

            const fileASTData = this.parseAST(artifactFilePath);

            console.log(`DEBUG: Parsed data for ${artifactFilePath} in buildFileLinks: ${JSON.stringify(fileASTData)} . `) //uncoment to debug 

            const CONNECTION_REGEX = /^connections?$/i

            visit(fileASTData, 'heading', (node, index, parent) => {
                const headingText = toString(node);

                if (CONNECTION_REGEX.test(headingText.trim())) {
                    const nextSibling = parent.children[index + 1];

                    if (nextSibling?.type !== 'table') return

                    console.log(`DEBUG: Found table in data while reading AST data from file. The data of the table is! ${JSON.stringify(nextSibling.children)} `) //uncoment to debug 

                    const dataRows = nextSibling.children.slice(1);

                    for (const row of dataRows) {
                        if (row.type !== 'tableRow') continue;
                        
                        const [categoryLabel, valueCell] = row.children;

                        console.log(`DEBUG: Reading row columns ${JSON.stringify(categoryLabel)} & ${JSON.stringify(valueCell)} `) //uncoment to debug 
                        
                        const classification = toString(categoryLabel).trim()
                        
                        console.log(`DEBUG: Extract classification text:! ${classification}`) //uncoment to debug 
                        visit(valueCell, 'link', (node) =>{
                            //console.log(`AST data in the node:! ${JSON.stringify(node)}`) //uncoment to debug 
                            console.log(`DEBUG: Extract url:! ${node.url}`) //uncoment to debug 

                            // ADR-009 Solve relative link duplication by building absolute path for realtive links
                            
                            const url = this.evaluateLinkRoute(artifactFilePath, node.url);
                            const customLinkName = node.children?.[0]?.value ?? "Unnamed Link"

                            console.log(`DEBUG: 'buildFileLinks' set ${node.url} to: ${url}`) //uncoment to debug 
                            fileLinksMap.set(url, {"classification": classification, "linkName": customLinkName});
                                
                        })

                    }

                }

            })

            return fileLinksMap;




        } catch (error) {
            console.error(`Fail to access or navigate AST data`, error);
            process.exit(1)
        }
        

    }

    /**
     * 
     * @param {string} artifactName 
     * @param {ArtifactRelatedFileConnection} data  - The Artifact related links object
     * @returns {Set} Returns a set of the artifact links in the data state passed
     */
    static buildRefsLinks(artifactName, data){
        /**@type {TraceableFile[]} */
        
        //Handles the case where the artifact does not exist in the data or is the first run and there is not past data
        if (!(artifactName in data)) return;

        const fileObj = data[artifactName];
        const linksSet = new Set()
        for(const file of fileObj){
            linksSet.add(file.path)
        }
        return linksSet
    }
    
    
  

    /**
     * @description Mutates the currentClassificationMap 
     * @param {mapOfClassifiedLinks} currentClassificationMap 
     * @param {fileLinksMap} fileLinksWithTypeMap 
     * @param {Set} pastRefsLinks 
     * @param {Set} currentRefsLinks 
     * @returns {mapOfClassifiedLinks}
     */
    static classifyAndConquerHard(currentClassificationMap, fileLinksWithTypeMap, pastRefsLinks, currentRefsLinks){
        
        /** @type {mapOfClassifiedLinks}*/
        const hardLinkClassifiedMap = currentClassificationMap;

        const fileLinks = Array.from(fileLinksWithTypeMap.keys())
        console.log(`DEBUG: In 'classifyAndConquerHard' about to define if this link are hand or not: ${JSON.stringify(fileLinks)}. `) //uncoment to debug
        for(const link of fileLinks){

            console.log(`DEBUG: In 'classifyAndConquerHard' Analizing link: ${link}. `) //uncoment to debug
            // The link data must be sets
            // inRp = in past reference artifact set
            // inRc = in current reference artifact set

            const inRp = pastRefsLinks?.has(link) || false;
            const inRc = currentRefsLinks?.has(link) || false;
            
            // HARD LINK case
            // Get the specific link classification and add it to the classify data structure
                
            if (!inRc && !inRp){

                console.log(`DEBUG: In 'classifyAndConquerHard' Link was classified as hard: ${!inRc && !inRp}. `) //uncoment to debug

                /** 
                 * @type {classificationAndLinkData}
                */
                const objHard = fileLinksWithTypeMap.get(link)

                //console.log(`DEBUG: In 'classifyAndConquerHard' hard link object: ${JSON.stringify(objHard)}. `) //uncoment to debug

                if(hardLinkClassifiedMap.get(objHard.classification)){
                    hardLinkClassifiedMap.get(objHard.classification).push({"link": link,"linkName": objHard.linkName, "isHand": true })
                }
                else{
                    hardLinkClassifiedMap.set(objHard.classification, [{"link": link,"linkName": objHard.linkName, "isHand": true }])
                }

            }


        }
        
        return hardLinkClassifiedMap;
    }

     /**
     * @param {mapOfClassifiedLinks} currentClassificationMap 
     * @param {ArtifactRelatedFileConnection | TraceableFile[]} connectedFilesInput - The source data, a raw array of traceable files comming for a specific artifact key connections.
     * @param {classificationGuidelines} guidelines
     * @param {regexExtractor} fileArtifactIdentifierReg - Selects only the artifact e.g: ("PRO-REQ-001" will extract "REQ")
     * @param {regexExtractor} fileExtensionExtractionReg - Selects only the extension after the "."  e.g: ("myFile.test.js" will extract "test.js")
     * @param {Set<string>} systemArtifactsSet - Valid system artifacts list
     * @returns {mapOfClassifiedLinks} - Map with mutated classification
     */
    static classifyAndConquerDynamic(currentClassificationMap, connectedFilesInput, guidelines, fileArtifactIdentifierReg, fileExtensionExtractionReg, systemArtifactsSet) {
        //1. Abstract the logic of classification to be define outside in the main thread
        //2. Use a map of types like {hardlinkMap}

        //console.log(`DEBUG: arguments passed to classifyAndConquerDynamic:`, currentClassificationMap, connectedFilesInput, guidelines, fileArtifactIdentifierReg, fileExtensionExtractionReg, systemArtifactsSet) //uncoment to debug
        console.log('DEBUG: *ClassifyAndConquerDynamic* This data is used to assign each file to a classification:', {connectedFilesInput});  // uncoment to debug

        connectedFilesInput.forEach( /** @param {TraceableFile} file */
    (file) => {

            console.log(`DEBUG: Figuring out the file name to identify: ${file.name}. `) //uncoment to debug
            const artifactIdentifier = file.name.match(fileArtifactIdentifierReg)?.[0]; 

            console.log(`DEBUG: Find the link identifier: ${artifactIdentifier}. `) //uncoment to debug

            // ?: checks if the value exist else return undefined .[0] extracts the value
            const extension = file.name.match(fileExtensionExtractionReg); 


            /**
             * @type {Set<string>} classification
             */
            const classification = new Set(); //Store the current classification

            // Artifact classification guidelines
            const artifactCategoryMap = guidelines.artifactCategoryMap
            

            // Extension classification guidelines
            const extensionCategoryMap = guidelines.extensionCategoryMap;

            // 1. Check Artifact Identifier
            if (artifactIdentifier) {
                const artifactCategory = artifactCategoryMap.get(artifactIdentifier);
                if (artifactCategory) classification.add(artifactCategory);
            }

            // 2. Check File Extension 
            if (extension) {
                const singleExt = extension[2];
                const doubleExt = extension[1] ? `${extension[1]}.${singleExt}` : null;

                const extensionCategory = extensionCategoryMap.get(doubleExt) || extensionCategoryMap.get(singleExt);
                
                if (extensionCategory) classification.add(extensionCategory);
            }

            // 3. Fallback
            if (classification.size === 0) {
                classification.add("📂 Other");
            }

            // Store the classify file to the proper property
            try{

              if(classification.size > 1){
                throw new MultiClassification(`The algoritm logic is selecting more than one category for the related file: ${file.name} \n This are the classifications:: ${[...classification]}`)
              }

              const singleCategory = [...classification][0];

             console.log('DEBUG: *ClassifyAndConquerDynamic* about to add:', { file: file.name, artifactIdentifier, extension, tag: singleCategory });  // uncoment to debug

              if(currentClassificationMap.get(singleCategory)){
                    currentClassificationMap.get(singleCategory).push({"link": file.path, "linkName": FALLBACK_LINK_NAME, "isHand": false  })
                }
                else{
                    currentClassificationMap.set(singleCategory, [{"link": file.path, "linkName": FALLBACK_LINK_NAME, "isHand": false }])
                }
              
            }
            catch(error){
              console.error('Categorization critical identification uncapability', error);
              process.exit(1);
              
            }
        })

        return currentClassificationMap
    }

    /**
     * @description Reads and extract the parsed json from a file.
     * @param {string} absolutePath - Absolute path the file to parse
     * @returns {Object} Parsed Object from JSON file data
     */
    static parseFileAndCatch (absolutePath){
        let fileData;

        try {
              fileData = readFileSync(absolutePath, "utf8");
              console.log(`DEBUG: current data in file to parse: ${fileData}`); //Uncoment to debug
            } catch (error) {
              console.error(`Fail to access the file ${absolutePath}`, error.message);
            }
        
            let dataJSON;
            try {
              dataJSON = JSON.parse(fileData);
              console.log(
                `DEBUG: Successfully parse the file data: ${JSON.stringify(dataJSON)}`,
              ); //Uncoment to debug

              return dataJSON;
            } catch (error) {
              console.error("Fail to parse the file data", error.message);
            }
            
    }

    /**
     * @description Finds a top level file within a valid git repository folder Otherwise it creates an empty one
     * @param {string} fileName - The name of the file to extract including its extension 
     * @returns {string} Abosulute path of the found file
     */
    static extractTopLevelFilePath (fileName){
        const worktreeFolder = findWorkTreePath();
        
        let items = [];
        try{
            items = readdirSync(worktreeFolder, { withFileTypes: true });
        }
        catch(error){
            console.error(`Failed to access or read ${worktreeFolder}`, error.message);
            process.exit(1);
        }
        
        let files = [];
        try{
            files = items.filter((item) => item.isFile());
        }
        catch(error){
            console.error(`Error extracting the files in dir: ${worktreeFolder}`, error)
            process.exit(1);
        }
        
        console.log(
              `DEBUG: Current files in the system ${JSON.stringify(files)}  `); //to debug uncoment

        /**@type {Dirent} */
        const foundFile = files.find((file) => file.name == fileName);
            
        let fullfilePath = '';
        if(!foundFile){
            console.log(`[Synapse |Set Up|] The file ${fileName} does not exist` )

            try{
                fullfilePath = path.join(worktreeFolder, fileName);
                console.log(`[Synapse |Set Up|] Creating file ${fileName}` );
                writeFileSync(fullfilePath, "{}");
            }
            catch(error){
                console.error(`[Synapse |Error|] The file ${fileName} couldn't be created`,  error )
                process.exit(1);
            }
            
        }else{
            fullfilePath = path.join(foundFile.parentPath, foundFile.name);
        }

        return fullfilePath;

    }

    /**
     * @param {mapOfClassifiedLinks} categorizedData - A Map with the table **areas** calssification and respective link data objects in that area
     * @param {string} artifactPath - The path of the artifact where connections are being categorized
     * @param {regexExtractor} fileAvoidExtensionReg - Selects only the name avoiding any data  after the "."  e.g: ("myFile.js" will avoid ".js")
     * @returns {Object} The AST Object table ready to embeded that creates a markdown table when stringify and render by a markdown engine
     */

    static buildASTMarkdownConnectionTable(categorizedData, artifactPath, fileAvoidExtensionReg) {
        console.log('IS RUNNING???')
        try {

            const artifactDir = path.dirname(artifactPath);

            const dynamicTable = {
                type: 'table',
                align: ['left', 'left'], // Set alignment for your two columns
                children: [
                    // 1. Your initial header row
                    {
                        type: 'tableRow',
                        children: [
                            { type: 'tableCell', children: [{ type: 'text', value: 'Type' }] },
                            { type: 'tableCell', children: [{ type: 'text', value: 'Route' }] }
                        ]
                    }
                ]
            } //How should the header look like

            const mapEntries = Array.from(categorizedData.entries());
            // Sort in order the way the table is build
            mapEntries.sort((a, b) => {
    // a[0] and b[0] represent the 'key' (the Type) in the [key, value] pair
    const cleanKeyA = a[0].replace(/\*\*/g, '').replace(/[^\x00-\x7F]/g, '').trim().toLowerCase();
    const cleanKeyB = b[0].replace(/\*\*/g, '').replace(/[^\x00-\x7F]/g, '').trim().toLowerCase();
    
    if (cleanKeyA < cleanKeyB) return -1;
    if (cleanKeyA > cleanKeyB) return 1;
    return 0;
});


            // where the iretation starts Object.entries(categorizedData)
            console.log(`DEBUG: The iterable array: ${JSON.stringify(Array.from(categorizedData.entries()))}, Once sort ; ${JSON.stringify(mapEntries)}. `) //uncoment to debug

            // Table To insert
            for (const [key, arrayOfUrls] of categorizedData) {
                /**
                * @type {string} key - Is the category on which a collection of traceableFiles[] are clasified
                * @type {TraceableFile[]} arrayOfObjects
                */

                if (Array.isArray(arrayOfUrls) && arrayOfUrls.length === 0) continue; // Skips empty connections in classification categories

                
                //Insert key (classification) with strong

                const newRow = {
                    type: 'tableRow',
                    children: [
                        // --- FIRST CELL ---
                        {
                            type: 'tableCell',
                            children: [
                                {
                                    type: 'strong',
                                    children: [{ type: 'text', value: `${key}` }]
                                }
                            ]
                        },

                        // --- SECOND CELL ---
                        {
                            type: 'tableCell',
                            children: [] // (You can put text nodes in here)
                        }
                    ]
                };

                const secondCellChildren = [];

                const SECOND_COLUMN_INDEX = 1;

                

                // Insert route or routes
                arrayOfUrls.forEach(url => {
                    

                    console.log(`DEBUG: within for each of buildASTMarkdownConnectionTable, iterating over : ${JSON.stringify(url)}. `) //uncoment to debug
                    let newLink;

                    // Determine if hand or dynamic 
                    if(url.isHand){
                        // Insert the second column
                        newLink = {
                            "type": "link",
                            "url": `${url.link}`,
                            "title": null,
                            "children": [
                                { "type": "text", "value": `${url.linkName}` }]
                        }
                    }else if(!url.isHand){
                        // Find the relative path from artifact to the connected file
                        const relativeFilePath = path.relative(artifactDir, url.link);
                        const nameWithoutExtension = path.basename(url.link).match(fileAvoidExtensionReg)?.[0] || path.basename(url.link);
                        
                        newLink = {
                            "type": "link",
                            "url": `${relativeFilePath}`,
                            "title": null,
                            "children": [
                                { "type": "text", "value": `${nameWithoutExtension}` }]
                        }
                    }

                    const newBR = { type: 'html', value: '<br />' };

                    if (secondCellChildren.length > 0) {
                        secondCellChildren.push({ type: 'html', value: '<br />' });
                    }

                    secondCellChildren.push(newLink);
                        

                       
                    
                })

                // Inserts the new row in the dynamic table after links were crafted

                // Assign the children of the cell 
                newRow.children[SECOND_COLUMN_INDEX].children = secondCellChildren;

                 //console.log(`DEBUG: The row being build by buildASTMarkdownConnectionTable : ${JSON.stringify(newRow)}. `) //uncoment to debug

                dynamicTable.children.push(newRow);

            }


            return dynamicTable;

        } catch (error) {
            console.error(`Fail insert the table in the AST object`, error);
            process.exit(1)
        }

    }

    
    /**
    * @description Converts the AST tree of the artifact into a new file content  
   
     * @param {string} artifactPath - The path of the artifact to write the connections
     * @param {string} astTable - The AST table object that should be inserted in the file
     * @param {*} connectionRegRule - The title that should be present to render the connection table below it 
     * @returns {string} updatedFile - The file with its previous content and the updated data, helpful data logic testing
     */
    static writeASTConnectionsToArtifact(artifactPath, astTable, connectionRegRule) {
        const serializeAST = (astNode) => {
        return String(
    unified()
      .use(remarkFrontmatter)
      .use(remarkGfm)       
      .use(remarkStringify) 
      .stringify(astNode)
  )};
        console.log(`DEBUG: Receiving in writeASTConnectionsToArtifact :`, {Path: artifactPath, TableToInsert: serializeAST(astTable), sectionRule: connectionRegRule   });

        const CONNECTION_REGEX = connectionRegRule;

        const fileASTData = this.parseAST(artifactPath);

        let headerFound = false;

        visit(fileASTData, 'heading', (node, index, parent) => {
            const headingText = toString(node);

            if (CONNECTION_REGEX.test(headingText.trim())) {
                const SIBLING_INDEX = index + 1
                const nextSibling = parent.children[SIBLING_INDEX];

                if (nextSibling?.type === 'table') {
                    parent.children[SIBLING_INDEX] = astTable;
                }
                else {
                    parent.children.splice(SIBLING_INDEX, 0, astTable)
                }

                headerFound = true;


            }


        })



        if (!headerFound) {
            console.log(`[Synapse |Constraint|] Skipped connections update for file: ${artifactPath} - No connections header found.`);
        }
        else {
            // Update the file data
            const updatedFile = serializeAST(fileASTData) //Stringify puts properties and content back together

            // Rewrite the file with the new content
            try {
                fs.writeFileSync(artifactPath, updatedFile, 'utf-8');
                return updatedFile;
            }
            catch (error) {
                if (error.code === 'ENOENT') {
                    console.warn(`File with path ${artifactPath} not found. Skipping write operation...`);
                }

            }

        }
    }

    /**
     * 
     * @param {ArtifactRelatedFileConnection} data - The current run system connection state snapshot 
     * @param {string} filePath - The absolute path of the .synapse-state.json
     * 
     */
    static writeJsonDataToFile(data, filePath){
        try {
            // Stringify 
             const curratedData = JSON.stringify(data);

              writeFileSync(filePath, curratedData);
              console.log("[synapse] Successfully update the connections .synapse-state.json snapshot");
              
            } catch (error) {
              console.error("[synapse] Fail to update the connections .synapse-state.json snapshot:", error);
            }
    }
}



