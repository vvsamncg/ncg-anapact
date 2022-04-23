/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/file', 'N/url', 'N/runtime', 'N/ui/serverWidget',
        '../common/const/ncg-anpc-const'],

    (file, url, runtime, ui, _const) => {

        const Fields = {
            SETTING: 'custscript_ncg_anpc_setting_id',
            TEMPLATE: 'custpage_templatefield',

            CREATE_CONTRACT: 'custpage_anpc_create_contrac',
            CONTRACT_LIST_TAB: 'custpage_anpc_contrac_tab',
            CONTRACT_LIST: 'custpage_anpc_contractlist'
        }

        const beforeLoad = (scriptContext) => {

            let ServerURL = url.resolveScript({
                scriptId: _const.Service.SCRIPT_ID_API,
                deploymentId: _const.Service.SCRIPT_DEPLOYMENT_API,
                returnExternalUrl: false
            });
            let ContractList = [url.resolveScript({
                scriptId: _const.Service.SCRIPT_ID_VIEW,
                deploymentId: _const.Service.SCRIPT_DEPLOYMENT_VIEW,
                returnExternalUrl: true
            })];

            try {
                const form = scriptContext.form;
                const type = scriptContext.type;
                const currentRecord = scriptContext.newRecord;
                const settingId = runtime.getCurrentScript().getParameter({
                    name: Fields.SETTING
                });

                if(!settingId) return;

                if(type == scriptContext.UserEventType.VIEW) {

                    let templateField = form.addField({
                        id: Fields.TEMPLATE,
                        type: ui.FieldType.INLINEHTML,
                        label: "Contract Template"
                    });

                    let template = file.load(_const.TemplatePath.CONTRACT)
                        .getContents();

                    templateField.defaultValue =
                        template.replace("{{custom-validator}}", file.load(_const.ScriptPath.FIELDS).url);

                    scriptContext.form.addButton({
                        id: Fields.CREATE_CONTRACT,
                        label: "Create Contract",
                        functionName: "showCreateContractUI('"+ServerURL +"','"+settingId+"')"
                    });
                }

                if (type == scriptContext.UserEventType.EDIT||
                        type == scriptContext.UserEventType.VIEW ) {

                    ContractList.push('&settings=' + settingId);
                    ContractList.push('&rectype=' + currentRecord.type);
                    ContractList.push('&recid=" + currentRecord.id' + currentRecord.type);

                    let htmlStr = ['<div width="100%">'];
                    htmlStr.push('<iframe src="');
                    htmlStr.push(ContractList.join(''));
                    htmlStr.push('" style="border:none;" height="500px" width="100%" title="Anapact Contract List">');
                    htmlStr.push('</iframe></div >');

                    form.addTab({
                        id: Fields.CONTRACT_LIST_TAB,
                        label: 'Contract List'
                    });

                    form.addField({
                        id: Fields.CONTRACT_LIST,
                        type: ui.FieldType.INLINEHTML,
                        container: Fields.CONTRACT_LIST_TAB,
                        label: ' ',
                    }).defaultValue = htmlStr;

                }
            } catch (e) {
                    log.debug({
                            title: "ERROR",
                            details: e.toString()
                    });
            }
        }

        return {beforeLoad}

    });
