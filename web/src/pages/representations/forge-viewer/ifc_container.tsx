import React, {useEffect, useRef, useState, ChangeEvent} from 'react';
import ForgeViewer from "./Forgeview";
import {useDispatch, useSelector} from "../../../hooks";
import {
    ForgeResponseState,
    getCheckStatus,
    getForgeToken,
    setURN,
    URNLoadState
} from "../../../services/redux/reducers/forge/forge.slice";
import axios from "axios";
import {getConfig} from "../../../utils/config";
import FileUpload from '../../../ui-components/input/FileUpload.component';
import { loadKnowledgeTree } from '../../../services/redux/reducers/project/knowledge-tree.slice';
import { Spinner } from 'react-bootstrap';
import ForgeService from '../../../api/service/auth-service/forge-auth-service';
import { useTranslation } from 'react-i18next';
import { RepresentationProps } from '../../../typings';
import toast from "react-hot-toast";
import {t} from "i18next";

const IFCContainer = (props: RepresentationProps) => {
    const forgeRef = useRef<any>();
    const dispatch = useDispatch();
    const [urnData, setUrnData] = useState('');
    const [isReady, setIsReady] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [parseFailed, setParseFailed] = useState(false);
    const [file, setFile] = useState<File>();
    const [, setProgress] = useState('');
    const forgeToken = useSelector<ForgeResponseState>((state) => state.forge);
    const urn = useSelector<String>((state) => state.urn.urn);
    const urn_load = useSelector<URNLoadState | null>((state) => state.urn_load.response.content);
    const nodeData = useSelector(state => state.nodeData);
    const intervalRef = useRef<any>(null);
    const intervalCountRef = useRef<number>(0);

    const { t } = useTranslation();

    useEffect(() => {
        dispatch(getForgeToken());
        setUrnData('');
    }, []);
    const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files[0]) {
            setUploading(true);
            setParseFailed(false);
            const file = new FormData();
            setFile(e.target.files[0]);
            file.append("file", e.target.files[0]);
            setIsReady(false);
            axios.post(getConfig().urlHostApi+"/public/forge/upload/"+props.nodeId+"?projectId="+props.projectId, file).then((res) => {
                if (res.data.content.result === "success") {
                    dispatch(setURN(res?.data?.content?.urn))
                    if (props.projectId) {
                        dispatch(loadKnowledgeTree(props.projectId));
                    }
                    setUrnData(res?.data?.content?.urn);
                }
                setUploading(false);
            }).catch(e => {
                console.log(e);
                setUploading(false);
                toast.error(t('upload-error'), { duration: 8000 })
            });
        }
    }
    const doCheckProgress = (urnStr: string) => {
        try {
            ForgeService.getCheckStatus(urnStr).then(
                (res) => {
                    if (res?.content) {
                        const { status, progress} = res?.content;
                        if (status === 'success') { 
                            clearInterval(intervalRef.current);
                            setIsReady(true);
                        } else if(status === 'failed') {
                            clearInterval(intervalRef.current);
                            setIsReady(false);
                            setUrnData('');
                            setParseFailed(true);
                            toast.error(t('forge-viewer-parse-failed'), { duration: 5000 });
                        }
                        if (progress && status === 'inprogress') {
                            setProgress(progress?.substring(0, progress?.indexOf("complete")));
                        }
                    } else {
                        clearInterval(intervalRef.current);
                        setIsReady(false);
                        setUrnData('');
                        setParseFailed(true);
                        toast.error(t('forge-viewer-parse-failed'), { duration: 5000 });
                    }
                }
            ).catch(e => {
                console.log({ e });
            });
        } catch(e){ console.log(e); }
    }
    const checkProgress = (urnStr: string) => {
        clearInterval(intervalRef.current);
        setIsReady(false);
        if (urnStr) {
            intervalRef.current = setInterval(() => {
                if (intervalCountRef.current > 9) {
                    clearInterval(intervalRef.current);
                }
                intervalCountRef.current = intervalCountRef.current + 1;
                doCheckProgress(urnStr);
            }, 10000);
        }
    }

    useEffect(() => {
        if (urnData.length > 0) {
            checkProgress(urnData);
        }
    }, [urnData]);
    useEffect(() => {
        setUrnData('');
        setIsReady(false);
        setParseFailed(false);
        if (props.activeNode?.attributes?.data) {
            doCheckProgress(props.activeNode?.attributes?.data?.toString());
        }
    }, [props.activeNode]);
    const renderUploader = () => uploading ? (
        <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', justifyContent: 'center', height: '95%' }}>
            <Spinner animation="border" variant="info" />
            <div
                style={{
                    marginLeft: 5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '80%'
                }}
            >
                {`${t('uploading')} ${file?.name ?? ''}`}
            </div>
        </div>
    ) : (
        <FileUpload nodeName={props.nodeName} className="center-input" name="upload" onChange={onUpload} />
    );
    const uploadOrDisplay = () => {
        if (forgeToken.response.content?.access_token.length > 0) {
            if (
                (props.activeNode?.attributes?.nodeType === 'model_3d' || props.activeNode?.attributes?.nodeType === 'ifc') &&
                    typeof props.activeNode?.attributes?.data === 'string') {
                return !parseFailed ? (
                    isReady ? (
                        <ForgeViewer
                            version="6.0"
                            expiresAt={3599}
                            token={forgeToken.response.content?.access_token}
                            urn={props.activeNode?.attributes?.data}
                            headless={false}
                            onSelectedGuid={""} />
                    ) : (
                        <div style={{
                            height: '100%',
                            width: '100%',
                            margin: 'auto',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                        }}
                        >
                            <Spinner animation="grow" variant="info" />
                            <span style={{ textAlign: 'center' }}>{t('preparing-model-data')}</span>
                        </div>
                    )
                ) : renderUploader();
            } else if (urnData.length > 0) {
                    return (
                        isReady ? (
                            <ForgeViewer
                                version="6.0"
                                expiresAt={3599}
                                token={forgeToken.response.content?.access_token}
                                urn={urnData}
                                headless={false}
                                onSelectedGuid={""} />
                        ) : (
                            <div style={{
                                height: '100%',
                                width: '100%',
                                margin: 'auto',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                            >
                                <Spinner animation="grow" variant="info" />
                                <span style={{ textAlign: 'center' }}>{t('preparing-model-data')}</span>
                            </div>
                        )
                    )
            } else {
                return renderUploader();
            }
        }
    }

    return (
        <div className={"adsk-viewing-viewer overlay-map"}>
            {uploadOrDisplay()}
        </div>
    );
};

export default IFCContainer;
