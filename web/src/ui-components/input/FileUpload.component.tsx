import { useRef, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import imagePlaceholder from '../../asset/svg/cloud-upload.svg';
export interface FileUploadProps {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    nodeName?: string;
    [key: string]: unknown;
};
const FileUpload = ({ onChange, nodeName, ...props }: FileUploadProps) => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [fileNames, setFileNames] = useState<Array<string>>([]);
    const { t } = useTranslation();
    const handleFileClick = () => {
        if (fileRef.current?.click) {
          fileRef.current.click();
        }
      };
    const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e);
        if (e?.target?.files) {
            const fNames: Array<string> = [];
            for (let i = 0; i < e?.target?.files?.length; i++) {
                fNames.push(e?.target?.files[i]?.name)
            }
            setFileNames(fNames);
        }
    }
    return (
        <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
            <div
                style={{
                    minWidth: 200,
                    minHeight: 200,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    cursor: 'pointer',
                }}
                tabIndex={0}
                role="button"
                onClick={handleFileClick}
            >
                <div style={{ width: 100, height: 100 }}>
                    <img width="100%" height="100%" style={{ cursor: 'pointer', objectFit: 'contain' }} src={imagePlaceholder} alt={''} />
                </div>
                <div style={{ maxWidth: '30vw', textAlign: 'center' }}>
                    {
                        fileNames.length > 0 ? (
                            <p>{fileNames.length > 1 ? fileNames.join(', ') : fileNames[0] }</p>
                        ) : (
                            nodeName  && <p>{t('upload-file-add-to-project', { name: nodeName })}</p>
                        )
                    }
                </div>
            </div>
            <input {...props} onChange={handleFilesChange} type='file' hidden ref={fileRef}/>
        </div>
    );
}
export default FileUpload;