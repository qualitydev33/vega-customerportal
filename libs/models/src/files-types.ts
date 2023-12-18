export interface IFile {
    roleid: string;
    id: string;
    filename: string;
    size: number;
    lastmodified: number;
}

export interface IGetFilesResponse {
    items: IFile[];
}

export interface IGetFileDownloadUrl {
    filename: string;
    url: string;
}

export interface IGetFileDownloadUrlsRequest {
    items: IFile[];
}

export interface IGetFileDownloadUrlsResponse {
    items: IGetFileDownloadUrl[];
}

export interface IPutFileUploadUrl {
    fileDownloadUrl: string;
    filePath: File;
}

export interface IDeleteFileRequest {
    items: IFile[];
}
