const generateConfig = (baseUrl: string, token: string) => `
  {
    "Version": "13.4.0",
    "Name": "${baseUrl}",
    "DestinationType": "ImageUploader",
    "RequestMethod": "POST",
    "RequestURL": "${baseUrl}/api/images",
    "Headers": {
      "Authorization": "Bearer ${token}"
    },
    "Body": "MultipartFormData",
    "FileFormName": "file",
    "URL": "${baseUrl}$json:url$",
    "ErrorMessage": "$json:error$"
  }`;

export default generateConfig;
