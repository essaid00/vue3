import { defHttp } from '/@/utils/http/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { useGlobSetting } from '/@/hooks/setting';

const { createMessage, createWarningModal } = useMessage();
enum Api {
  files = '/upload/api/files',
  downloadFileZip = '/upload/api/downloadFileZip',
}
export const XLSX_MIME_TYPE = 'application/octet-stream';
/**
 * 导出文件xlsx的文件后缀
 */
export const XLSX_FILE_SUFFIX = '.zip';
export const getDownloadFileZip = (params) => {
  const data = defHttp.post({ url: Api.downloadFileZip, params, responseType: 'blob', timeout: 60000 }, { isTransformResponse: false });
  if (!data) {
    createMessage.warning(params.name);
    return;
  }
 
   const name = params.name;
 
  const blobOptions = { type: 'application/octet-stream' };
  let fileSuffix = '.zip';

  blobOptions['type'] = XLSX_MIME_TYPE;
  fileSuffix = XLSX_FILE_SUFFIX;

  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    window.navigator.msSaveBlob(new Blob([data], blobOptions), name + fileSuffix);
  } else {
    const url = window.URL.createObjectURL(new Blob([data], blobOptions));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', name + fileSuffix);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  }
};
export const getFiles = (params) => defHttp.get({ url: Api.files, params }, { isTransformResponse: false });
