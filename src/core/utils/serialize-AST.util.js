 import{ unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkFrontmatter from 'remark-frontmatter';
 
 /**
  * 
  * @param {Object} astNode - The AST object ready to stringify
  * @returns {string}  AST converted to a string
  */
 //@trace SREQ-020B @
 export const serializeAST = (astNode) => {
        return String(
    unified()
      .use(remarkFrontmatter)
      .use(remarkGfm)       
      .use(remarkStringify) 
      .stringify(astNode)
  )};