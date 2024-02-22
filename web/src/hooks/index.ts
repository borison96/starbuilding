import { TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import type { RootState, AppDispatch } from "../services/redux/store";

export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const connectDOMObserver = (query: string, changeType: MutationRecordType, callback: (arg?: MutationRecord) => void) => {
    const targetNode = document.querySelector(query);
    if (targetNode) {
        const config = { [changeType]: true };
        let debounceId = -1;
        const mutationCallback = (mutationList: MutationRecord[]) => {
            for(const mutation of mutationList) {
                if (mutation.type === changeType) {
                    clearTimeout(debounceId);
                    debounceId = window.setTimeout( () => callback(mutation), 300);
                }
            }
        }
        const observer = new MutationObserver(mutationCallback);
        observer.observe(targetNode, config);
        return observer.disconnect
    }
    return () => {};
}
