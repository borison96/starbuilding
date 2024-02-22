import { KnowledgeNodeDatum, NodeTableData, TreeNodeType } from "../typings";

export const sortTreeNodes = (a: TreeNodeType, b:TreeNodeType): number => {
    if (b?.parent && a?.parent) {
        if (b?.parent?.data?.attributes?.id === a?.data?.attributes?.id) {
            return -1;
        } else if (a?.parent?.data?.attributes?.id === b?.data?.attributes?.id) {
            return 1;
        }
        return 0;
    }
    if (b?.parent) {
        return -1;
    } else if (a?.parent) {
        return 1;
    }
    return 0;
};
export const sortDataTableProjects = (a: any, b: any) => {
    if (a.id > b.id) return 1;
    if (a.id < b.id) return -1
    return 0;
}
export const newTreeNode: KnowledgeNodeDatum = {
    "name": "",
    "attributes": {
      "id": "8b8ed3c02c734fd0b712f903c0bcd920",
      "description": "New project",
      "nodeType": "empty"
    },
    "children": [
    ]
};

export const getCurrentLocation = () => new Promise<GeolocationPosition>(
    (resolve, reject) => {
        const { navigator: { geolocation }} = window;
        if (geolocation) {
            geolocation.getCurrentPosition(
                (position) => resolve(position),
                (err) => reject(err),
            )
        } else {
            reject("Geolocation is not supported on this browser");
        }
    }
);

export const getCanvasFromImage = (src: string, options: {
    r: number;
    g: number;
    b: number;
    a?: number;
    text?: string;
    x?: number;
    y?: number;
    font?: string;
}) => {
    const image = document.createElement('img');
    image.src = src;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    
    image.onload = function() {
        if (context) {
            context.drawImage(image, 0, 0, image.width, image.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const {r, g, b, a, text, x, y, font} = options;
            for (let i = 0, ii = data.length; i < ii; i = i + 4) {
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                if (a) {
                    data[i + 3] = a;
                }
            }
            context.putImageData(imageData, 0, 0);
            if (text) {
                context.fillStyle = a ? `rgba(${r},${g},${b}, ${a})` : `rgb(${r},${g},${b})`;
                context.font = font ?? '20px bolder';
                context.textAlign = 'center';
                context.fillText(text, x ?? canvas.width / 2, y ?? canvas.height / 2.5);
            }
        }
    }
    return canvas;
}

export const addTextToCanvas = (canvas: HTMLCanvasElement, options: {
    r: number;
    g: number;
    b: number;
    a?: number;
    text?: string;
    x?: number;
    y?: number;
    font?: string;
}) => {
    const context = canvas.getContext('2d');
    const {r, g, b, a, text, x, y, font } = options;
    if (text && context) {
        context.fillStyle = a ? `rgba(${r},${g},${b}, ${a})` : `rgb(${r},${g},${b})`;
        context.font = font ?? '20px bolder';
        context.textAlign = 'center';
        context.fillText(text, x ?? canvas.width / 2, y ?? canvas.height / 2.5);
    }
    return canvas;
}
export const validator = {
    isEmail: (email: string) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email),
    isValidPassword: (password: string) => /^(?=.{8,})(?=.*[^A-Za-z0-9])/g.test(password),
}

export const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
        let oldScript = document.querySelector(`script[src="${src}"]`);
        if (!oldScript) {
            let script = document.createElement('script');
            script.onload = resolve;
            script.onerror = reject;
            script.src = src;
            script.type = 'text/javascript';
            script.async = true;
            document.body.appendChild(script);
        }
        else resolve({});
    });
};

export const getStatus = (_status: any, { rgb }: { rgb: boolean } = { rgb: false }) => {
    const status = _status ?? 'todo';
    let color = rgb ? '237, 110, 64' : '#ED6E40';
    switch(status) {
        case 'in-progress':
            color = rgb ? '192, 152, 32' : '#c09820';
            break;
        case 'in-review':
            color = rgb ? '140, 187, 95' : '#8CBB5F';
            break;
        case 'planned':
        case 'started':  
            color = rgb ? '41, 94, 167': '#295EA7';
            break;
        case 'blocked':
            color = rgb ? '227, 63, 26' : '#E33F1A';
            break;
        case 'todo':
            color = rgb ? '149, 149, 149' : '#959595';
            break;
        case 'done':    
        case 'delivered':
        case 'deployed':
        case 'completed':  
            color = rgb ? '41, 167, 74' : '#29A74A';
            break;
        default:
            break;
    }
    return { status, color };
}
export const getNodeCompletionRate = (node: KnowledgeNodeDatum, accept: Array<string> = ['done', 'deployed', 'delivered'], exclude: Array<string> = ['empty']) => {
    let count = node?.children?.filter(p => !exclude.includes(p?.attributes?.nodeType?.toString())).length;
    if (!count) { return 0; }
    const counted = node?.children?.filter(p => accept.includes(p?.attributes?.status?.toString()))?.length ?? 0;
    return counted / count;
}
export const selectTreeNode = (id: string) => new Promise(resolve => {
        const select = () => {
            const treeNodeEl = document.getElementById(`tree-node-${id}`) as HTMLElement;
            if (treeNodeEl) {
                treeNodeEl.dispatchEvent(new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                  }));
                return treeNodeEl;
            }
            return null;
        }
        const nodeEl = select();
        if (nodeEl) {
            resolve(nodeEl);
        } else {
            setTimeout(() => {
                resolve(select());
            }, 150);
        }
});
export const dateToInputString = (date: Date) => {
    return `${date.getFullYear()}${date.getMonth() + 1 < 10 ? '-0' + date.getMonth() : '-' + date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
}
export const formatFileSize = (size: number): string => {
    const GB = 1000000000;
    const MB = 1000000;
    const KB = 1000;
    if (size / GB > 1) {
        return (size / GB).toFixed(3) + ' GB';
    }
    if (size / MB > 1) {
        return (size / MB).toFixed(3) + ' MB';
    }
    if (size / KB > 1) {
        return (size / KB).toFixed(3) + ' KB';
    }
    return size + ' B';
}
type IntersectionOptions = {
    root: HTMLElement | null,
    rootMargin?: string,
    threshold: number | number[],
};
type IntersectionCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;
export const intersectionObserver = (target: HTMLElement, callback: IntersectionCallback, options: IntersectionOptions) => {
    let observer = new IntersectionObserver(callback, options);
    observer.observe(target);
    return () => observer.unobserve(target);
}
