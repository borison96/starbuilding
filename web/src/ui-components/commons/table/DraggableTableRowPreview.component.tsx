import { useTranslation } from "react-i18next";
import { getStatus } from "../../../utils";
import { DragKnowledgeNodeItemType } from "../../drag-n-drop";
import './drag-preview.scss';
const DraggableTableRowPrewiew = ({ item }: { item?: DragKnowledgeNodeItemType }) => {
    const st = getStatus(item.status, { rgb: true });
    const { t } = useTranslation();
    return (
        <div className="drag-preview" style={{ display: 'flex', alignItems: 'center', padding: 5, border: `1px solid rgb(${st.color})`, background: '#fff', maxWidth: '50vw' }}>
            <div style={{ margin: '0 5px', fontSize: 16 }}>{item?.name}</div>
            <div style={{ marginRight: 5, fontSize: 10, color: "#888" }}>{item.description}</div>
            <div style={{ marginRight: 5, color: `rgb(${st.color})`}} >{t(st.status)}</div>
            {
                item?.nodeType && <div style={{ marginRight: 5, fontSize: 10, color: "#888" }}>{t(item?.nodeType)}</div>
            }
        </div>
    )
}
export default DraggableTableRowPrewiew;
