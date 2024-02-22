import { useEffect } from 'react';
import 'table2excel';
type ExportToExcelButtonProp = {
    getRef: () => string | HTMLElement;
    fileName: string;
    icon?: JSX.Element | (() => JSX.Element);
};

const ExportToExcelButton = ({ getRef, fileName, icon }: ExportToExcelButtonProp) => {
    const handleClick = () => {
        const Table2Excel = window.Table2Excel;
        const table2excel = new Table2Excel({ defaultFileName: fileName, tableNameDataAttribute: fileName });
        const table = getRef();
        const el: HTMLElement = typeof table === 'string' ? document.querySelector(table) : table?.cloneNode(true) as HTMLElement;
        if (el) {
            let dataTags = el.querySelectorAll('td');
            for (let i = 0; i < dataTags.length; i++) {
                const div = document.createElement('div');
                div.innerHTML = dataTags[i].innerHTML;
                // get input values
                if (!dataTags[i].innerText?.trim()) {
                    const inp = div.querySelector('input');
                    dataTags[i].innerHTML = inp?.value ?? "";
                } else {
                    // exclude hidden fields
                    const sp = div.querySelector("span");
                    if (sp && sp.style.visibility === 'hidden') {
                        dataTags[i].innerText = "";
                    }
                    if (dataTags[i].innerText?.endsWith("%")) {
                        let perc = parseInt(dataTags[i].innerText.substring(0, dataTags[i].innerText.length - 1));
                        if (!Number.isNaN(perc)) {
                            dataTags[i].innerText = (perc / 100).toFixed(3);
                        }
                    }
                }
            }
            table2excel.export(el);
        }
    }
    return (
        <button style={{ background: 'transparent', border: 'none', outline: 'none', padding: 2, margin: 0 }} onClick={handleClick}>
            {
                icon ?? <span>Download</span>
            }
        </button>
    );

}
export default ExportToExcelButton;
