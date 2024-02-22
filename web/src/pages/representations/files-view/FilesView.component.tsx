import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProjectService from "../../../api/service/project-service/project-service";
import ErrorBoundary from "../../../errors/ErrorBoundary.component";
import { useSelector, useDispatch } from "../../../hooks"
import { updateKnowledgeBase } from "../../../services/redux/reducers/project/projects.slice";
import { FilesListing, SignedUrlResponse, TreeNodeType } from "../../../typings";
import CirclePlusIcon from "../../../ui-components/icons/CirclePlus.icon";
import FileUpload from "../../../ui-components/input/FileUpload.component";
import { formatFileSize, selectTreeNode, sortTreeNodes } from "../../../utils";
import './filetable.scss';

let miniViewer: Window = null;

export const FilesView = () => {
    const activeProject = useSelector(state => state.treeNode.project);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const activePath = useSelector(state => state.treeNode.activeNodePath);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const [prefix, setPrefix] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File>();
    const [listing, setListing] = useState(true);
    const [filesList, setFilesList] = useState<FilesListing>();

    const fileRef = useRef<HTMLInputElement>(null);
    const [addFile, setAddFile] = useState<File>();
    const [signedKeys, setSignedKeys] = useState<Record<string, SignedUrlResponse & { exp: Date }>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        let prefx = '';
        if (activePath && Object.keys(activePath).length) {
            const prefixing = Object.values<TreeNodeType>(activePath ?? {})
                .sort(sortTreeNodes);
            prefx = prefixing.reduce((acc, val) => acc + ( acc ? "/" : "") + (val.data.attributes.id ?? ''), '');
        } else if (activeProject?.tree != null) {
            prefx = activeProject?.tree?.attributes?.id ?? '';
            console.log(activeProject?.tree?.attributes?.id);
            if (prefx) {
                prefx += "/";
            }
        }
        if (prefx) {
            setPrefix(prefx);
            ProjectService.listProjectNodeFiles(activeProject?.id, prefx).then(
                nodeList => {
                    setFilesList(nodeList);
                }
            );
        }
        setListing(true);
        setFile(null);
        setAddFile(null);
    }, [activeProject, activePath]);
    const handleCreateDocumentNode = () => {
        if (file && name && activeNode?.data?.attributes?.id) {
            setUploading(true);
            const form = new FormData();
            form.append('file', file);
            form.append('name', name);
            form.append('prefix', prefix);
            form.append('description', description);
            form.append('parentNodeId', activeNode?.data?.attributes?.id);
            ProjectService.addDocumentNode(activeProject?.id, form).then(
                tree => {
                    setUploading(false);
                    dispatch(updateKnowledgeBase({ id: activeProject?.id, tree }));
                    setFile(null);
                    setDescription('');
                    setName('');
                    setListing(true);
                }
            ).catch(() => setUploading(false));
        }
    }
    const handleAddDocument = () => {
        const nodeId = activeNode?.data?.attributes?.id;
        if (addFile && nodeId) {
            setUploading(true);
            const form = new FormData();
            form.append('file', addFile);
            form.append('prefix', prefix);
            form.append('parentNodeId', nodeId);
            ProjectService.addFileToNode(activeProject?.id, nodeId, form).then(
                tree => {
                    setUploading(false);
                    dispatch(updateKnowledgeBase({ id: activeProject?.id, tree }));
                    setAddFile(null);
                }
            ).catch(() => setUploading(false));
        }
    }
    const handleFileClick = () => {
        if (fileRef.current?.click) {
          fileRef.current.click();
        }
      };
    const handleFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files) {
            setAddFile(e?.target?.files[0]);
        }
    }
    const isSignedAndValid = (signed: SignedUrlResponse & { exp: Date }) => {
        return signed && (signed.exp.getTime() > new Date().getTime());
    }
    const openMiniViewer = (key: string) => {
        if (miniViewer == null || miniViewer.closed) {
            const windowFeatures = "scrollbars=yes,top=200,left=600,width=600,height=800";
            miniViewer = window.open('', 'mini-files-viewer', windowFeatures);
        }
        const signed = signedKeys[key];
        if (isSignedAndValid(signed)) {
            miniViewer.location.href = signed.url;
        } else {
            ProjectService.signFileKey(activeProject?.id, key).then(
                (res) => {
                    miniViewer.location.href = res.url;
                    setSignedKeys((prev) => ({...prev, [key]: {...res, exp: new Date(new Date().getTime() + res.validitySeconds * 1000 )} }));
                }
            )
        }
    }
    return (
        <ErrorBoundary>
            <div hidden={listing} style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => setListing(true)} className="new-node-dismiss-xx">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <FileUpload onChange={(e) => setFile(e?.target?.files[0])} nodeName={activeNode?.data?.name} />
                <div style={{ display: 'flex', width: '100%', marginBottom: 10 }}>
                    <label style={{ flex: 1 }} htmlFor="name">{t('node-name')}:</label>
                    <input
                        value={name}
                        className="upload-file-input-xx"
                        id="name"
                        type="text"
                        onChange={(e) => setName(e?.target?.value)}
                        placeholder={t('node-name')}
                    />
                </div>
                <div style={{ display: 'flex', width: '100%', marginBottom: 10 }}>
                    <label style={{ flex: 1 }} htmlFor="description">{t('description')}:</label>
                    <input
                        value={description} className="upload-file-input-xx"
                        id="description"
                        type="text"
                        onChange={(e) => setDescription(e?.target?.value)}
                        placeholder={t('description')}
                    />
                </div>
                {
                    uploading ? (
                        <div style={{ marginLeft: 5, display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <button
                            disabled={file == null || !name?.trim()}
                            type="button"
                            className="upload-file-btn-xx"
                            onClick={handleCreateDocumentNode}
                        >
                            {t('upload')}
                        </button>
                    )
                }
            </div>
            <div hidden={!listing} style={{ marginTop: 15 }}>
            <button style={{ border: 'none', borderRadius: 45, marginBottom: 10, padding: '5px 10px' }} onClick={() => setListing(false)}>
                <CirclePlusIcon />
                {t('new-node')}
            </button>
            {
                (activeNode?.data?.attributes?.id && activeProject?.id) ? (
                    <table className="file-table-xx">
                        <thead>
                            <tr>
                                <th>{t('name')}</th>
                                <th>{t('type')}</th>
                                <th>{t('last-modified')}</th>
                                <th>{t('size')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filesList?.objects?.map(
                                    (obj) => {
                                        const objName = obj.key.substring(obj.key.lastIndexOf("/")).replace(/\//g, "");
                                        return (
                                            <tr key={objName}>
                                                <td>
                                                    <button
                                                        onClick={() => openMiniViewer(obj.key)}
                                                        className="open-btn"
                                                        title={objName}
                                                    >
                                                        {objName}
                                                    </button>
                                                </td>
                                                <td>{objName.substring(objName.lastIndexOf(".")).replace(/\./g, "")}</td>
                                                <td>{new Date(obj.lastModifiedAt).toLocaleDateString()}</td>
                                                <td>{formatFileSize(obj.size)}</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                            {
                                filesList?.commonPrefixes?.map(
                                    (pre) => {
                                        const objName = pre.substring(pre.lastIndexOf("/", pre.length - 2)).replace(/\//g, "");
                                        const folderNode = activeNode?.data?.children.find(f => f.attributes?.id === objName);
                                        return (
                                            <tr key={objName}>
                                                <td>
                                                <button style={{
                                                    border: 'none',
                                                    padding: 0,
                                                    background: 'transparent',
                                                    color: '#33a',
                                                    textDecoration: 'underline',
                                                    maxWidth: 200,
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }} onClick={() => selectTreeNode(folderNode?.attributes?.id)}
                                                    title={folderNode?.name ?? ''}
                                                >
                                                    {folderNode?.name ?? ''}
                                                </button>
                                                </td>
                                                <td>{t('folder')}</td>
                                                <td>--</td>
                                                <td>--</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                            <tr>
                                <td colSpan={100} style={{ textAlign: 'left' }}>
                                    <input onChange={handleFilesChange} type='file' hidden ref={fileRef}/>
                                    {
                                        addFile == null ? (
                                            <button
                                                style={{
                                                    border: 'none',
                                                    borderRadius: 5,
                                                    padding: '5px 10px',
                                                    background: 'transparent'
                                                    }}
                                                    onClick={handleFileClick}
                                            >
                                                <CirclePlusIcon fill="#33a" />
                                                {t('new-file')}
                                            </button>
                                        ) : null
                                    }
                                    {
                                        addFile ? (
                                            (uploading ? (
                                               <div style={{ marginLeft: 5 }}>
                                                     <Spinner animation="border" size="sm" variant="primary" />
                                               </div>
                                            ) : <button
                                                    className="upload-file-btn-xx"
                                                    onClick={handleAddDocument}
                                                >
                                                    <div>{t('upload')}</div>
                                                    <div style={{marginLeft: 5}} />
                                                    <div>{addFile?.name}</div>
                                                </button>
                                            )
                                        ) : null
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : null
            }
        </div>
        </ErrorBoundary>
    );
}
