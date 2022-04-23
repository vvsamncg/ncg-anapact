/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/url', 'N/search', 'N/file',
        '../common/api/ncg-anpc-api',
        '../common/const/ncg-anpc-const'
    ],
    
    (url, search, file, _api, _const) => {

        const onRequest = (scriptContext) => {
            const response = scriptContext.response;
            const request = scriptContext.request;

            if(!request.parameters.setting ||
                    !request.parameters.rectype ||
                        !request.parameters.recid){
                response.write("You must specify the anapact settings.");
            }

            const ServerURL = url.resolveScript({
                scriptId: _const.Service.SCRIPT_ID_API,
                deploymentId: _const.Service.SCRIPT_DEPLOYMENT_API,
                returnExternalUrl: true
            });

            const fileObj = file.load(_const.TemplatePath.CONTRACT_LIST);
            let contents = fileObj.getContents();
            contents = contents.replace("{{serverURL}}", "let serverURL='" + ServerURL + "'")

            response.write(contents);
        }

        return {onRequest}

    });