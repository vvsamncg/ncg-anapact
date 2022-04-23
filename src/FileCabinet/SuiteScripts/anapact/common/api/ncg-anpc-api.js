define(['N/log', 'N/https',
        '../gateway/ncg-anpc-settings',
        '../util/ncg-anpc-encrypt'
    ],
    (
        log, https,
        _settings,
        _encrypt

    ) => {

        const ResponseCode = {
            SUCCESS: 200,
            SUCCESS2: 201
        }

        const Url = {
            GET_TOKEN: '/External/Get/',
            GET_ALL_TEMPLATES: '/External/getalltemplates',
            VALIDATE_CONTRACT_NAME: '/External/IsContractNameExists/',
            SAVE_CONTRACT: '/External/SaveContract',
            GET_CONTRACTS: '/External/GetContractList/',
            VIEW_CONTRACT: '/Contract/ContractView'
        }

        let setting;

        const init = (settingId) => {
            setting = _settings.getSettings({
                settingId: settingId
            });
        }

        const makeRequest = (options) =>{
            let response = '';
            log.debug("headers", options.headers);
            try{
                let req = {
                    method: options.method,
                    url: options.url,
                    headers: options.headers || null,
                    parameters: options.params || null,
                    body: options.body || null
                };

                log.error({ title: 'makeRequest', details: req });

                response = https.request(req);

                //if(ResponseCode.SUCCESS != response.code) throw response;
                let httpBody = (response && response.body) ? JSON.parse(response.body) : null;

                log.debug('makeRequest.response', httpBody);

                if(httpBody.statusCode != ResponseCode.SUCCESS && httpBody != ResponseCode.SUCCESS2) {
                    return httpBody;
                }

                return JSON.parse(httpBody.body);

            }catch(ex){
                log.error({ title: 'Error calling api: ' + JSON.stringify(options), details: ex });
                return null;
            }
        }

        const generateToken = () => {
            let dataEncrypt =_dataEncrypt({
                EmailId: setting.email,
                KeyNumber: setting.tenant_id
            });

            let url = [setting.contract_url, Url.GET_TOKEN, dataEncrypt].join('');
            let data = makeRequest({
                method: https.Method.GET,
                url: url
            });

            log.debug('generateToken', data);

            return data.UserToken;
        }

        const getAllTemplates = () => {
            let token = generateToken();
            let url = [setting.contract_url, Url.GET_ALL_TEMPLATES].join('');

            let response = makeRequest({
                method: https.Method.GET,
                headers: _generateHeader(token),
                url: url
            });
            log.debug('getAllTemplates', response);

            return response;
        }

        const createContract = (body) => {
            let token = generateToken();
            let url = [setting.contract_url, Url.SAVE_CONTRACT].join('');

            let data = {
                id: "",
                ContractInfo: {
                    docType: "",
                    Status: "Draft",
                    NegotiationView: "",

                    ContractName: body.contractName,
                    ContractTemplateName: data.contractTemplateName,
                    ContractTemplateContent: data.contractTemplateContent,

                    ContractTypeName: data.contractTypeName,
                    SetWorkFlowList: data.setWorkFlowList,
                    MetDataFieldList: JSON.stringify(data.metDataFieldList),
                    DynamicFields: JSON.stringify(data.dynamicFields),
                    metDataField: data.metDataFieldList,
                    SupportingFiles : data.supportingFiles,

                    NotesList: [],

                    IsNetsuiteContract: true,
                    NetsuiteFormType: body.recordType,
                    NetsuiteFormId: body.recordId
                }
            };


            const enCrypt = _encrypt.encryptJS(
                JSON.stringify(data)
            );
            const dataToEncrypt = {
                inputData: enCrypt
            };
            const options = {
                method: https.Method.POST,
                headers: _generateHeader(token),
                body: JSON.stringify(dataToEncrypt),
                url: url,
            };
            let response = makeRequest(options);
            return response;
        }

        const validateContractName = (contractName) => {
            let token = generateToken();
            let url = [setting.contract_url, Url.VALIDATE_CONTRACT_NAME, _encrypt.encryptJS(contractName)].join('');
            const options = {
                method: https.Method.GET,
                headers: _generateHeader(token),
                url: url,
            };
            let response = makeRequest(options);
            return response;
        }

        const getContracts = (recordId) => {
            let token = generateToken();
            let url = [setting.contract_url, Url.GET_CONTRACTS, _encrypt.encryptJS(recordId)].join('');
            const options = {
                method: https.Method.GET,
                headers: _generateHeader(token),
                url: url,
            };
            let response = makeRequest(options);

            if(response.length > 0) {
                response = response.map(contract => {
                    const newDt = new Date(contract.modifiedOn);
                    contract.newDt = [
                        newDt.getMonth() + 1,
                        newDt.getDate(),
                        newDt.getFullYear()
                    ].join('/');

                    const contractViewLink = [
                        setting.app_url,
                        Url.VIEW_CONTRACT,
                        "?eData=",
                        _encrypt.encryptJS((contract.id))
                    ].join('')

                    contract.viewContractLink = contractViewLink;
                    return contract;
                });
            }

            return response;
        }

        const _generateHeader = (token) => {
            let header = [];
            header['Authorization'] = token;
            header['Access-Control-Allow-Origin'] = "*";
            header['Content-type'] = 'application/json; charset=utf-8';
            return header;
        }

        const _dataEncrypt = (data) =>{
            return _encrypt.encryptJS(
                JSON.stringify(data)
            )
        }

        return {
            init,
            getAllTemplates,
            createContract,
            validateContractName,
            getContracts
        }

    });
