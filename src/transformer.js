const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const tropes = require('./tropes');

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateJSDoc() {
  const verb = getRandom(tropes.jargon.verbs);
  const adj = getRandom(tropes.jargon.adjectives);
  const noun = getRandom(tropes.jargon.nouns);
  
  return `*
 * ${verb}s the ${adj} ${noun} to ensure maximum throughput.
 * 
 * @param {any} input - The input vector/tensor/thing.
 * @returns {Promise<void>} - A promise that resolves when the entropy is sufficiently high.
 * @ai-generated true
 * @confidence 0.001%
 `;
}

function hallucinate(code) {
  const ast = parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'classProperties']
  });

  traverse(ast, {
    // 1. Emoji-fy and expand existing comments
    enter(path) {
      if (path.node.leadingComments) {
        path.node.leadingComments.forEach(comment => {
          if (!comment.value.includes('✨')) { // Avoid double-bombing
            comment.value = ` ${getRandom(tropes.emojis)} ${comment.value.trim()} [AI Verified]`;
          }
        });
      }
    },

    // 2. Add JSDoc to functions (Declarations & Expressions)
    'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression'(path) {
      const node = path.node;
      
      // Only target "simple" functions (e.g., small body or no existing docs)
      // We check if it already has comments to avoid messing up real docs too much, 
      // but let's be aggressive for the joke.
      const hasJSDoc = node.leadingComments && node.leadingComments.some(c => c.value.startsWith('*'));
      
      if (!hasJSDoc) {
        const jsdoc = {
          type: 'CommentBlock',
          value: generateJSDoc()
        };
        
        // Attach comment to the node
        if (!node.leadingComments) node.leadingComments = [];
        node.leadingComments.push(jsdoc);
      }

      // 3. Inject Console Logs & Random TODOs inside the function body
      if (node.body && node.body.type === 'BlockStatement') {
         // 20% chance to add a TODO at the start
         if (Math.random() > 0.8) {
             const todoComment = {
                 type: 'CommentLine',
                 value: ` TODO: ${getRandom(tropes.todos)}`
             };
             if (!node.body.innerComments) node.body.innerComments = [];
             node.body.innerComments.push(todoComment); // inner comments often attach to the first statement
             
             // Fallback: if innerComments doesn't print nicely, unshift a dummy statement with comment
             // But let's try pushing a statement instead
             const statement = t.expressionStatement(t.stringLiteral("placeholder"));
             t.addComment(statement, "leading", ` TODO: ${getRandom(tropes.todos)}`, true);
             // We won't actually push the string literal, just the comment? 
             // Easier: Just push a console log with the TODO as a side effect? 
             // Let's just push a console log.
         }

         // 30% chance to add a console log
         if (Math.random() > 0.7) {
             const logString = getRandom(tropes.logs);
             const logStatement = t.expressionStatement(
                 t.callExpression(
                     t.memberExpression(t.identifier('console'), t.identifier('log')),
                     [t.stringLiteral(logString)]
                 )
             );
             node.body.body.unshift(logStatement);
         }
      }
    }
  });

  // 4. Add Top Level Disclaimer
  const output = generate(ast, {}, code);
  return tropes.aiDisclaimer + output.code;
}

module.exports = { hallucinate };
