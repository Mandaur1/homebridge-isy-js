module.exports = function(api) {
     api.cache.never();
    return {

    plugins: [
        ["module-resolver", {
            extensions: [".js"],
            resolvePath(sourcePath, currentFile, opts) {

                let s = "asda";
                let homebridgeSearchPaths = ['/homebridge/', '/usr/local/lib/node_modules/', '/usr/lib/node_modules/', '../'];
                let hapnodejsSearchPaths = homebridgeSearchPaths.concat(homebridgeSearchPaths.map(p => p + 'homebridge/node_modules/'));

                if(sourcePath.includes('homebridge'))
                {
                    let varName = require.resolve(sourcePath, {paths: homebridgeSearchPaths});
                    if(varName !== null && varName !== undefined)
                    {
                        console.log('Reference to module ' + sourcePath + ' in ' + currentFile + ' mapped to: ' + varName);
                        return varName;
                    }
                    else
                    {
                        console.error(sourcePath + ' not found.');

                    }

                    /**
                     * The `opts` argument is the options object that is passed through the Babel config.
                     * opts = {
                     *   extensions: [".js"],
                     *   resolvePath: ...,
                     * }
                     */
                 }
                 else if(sourcePath.includes('hap-nodejs')){

                    let varName = require.resolve(sourcePath, {paths:hapnodejsSearchPaths
                    });
                     if (varName !== null && varName !== undefined) {
                         console.log('Reference to module ' + sourcePath + ' in ' + currentFile + ' mapped to: ' + varName);
                         return varName;
                     } else {
                         console.error(sourcePath + ' not found.');

                 }
                }
                return null;
            }
        }]
    ]
}
}