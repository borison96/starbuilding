import '../controls.scss';
export type OptionType = {label: string; value: string | number; description?: string; checked?: boolean; };
export type InlineSelectChangeDataType = {
    target: OptionType;
    selection: Array<OptionType>;
};
export type InlineSelectPropType = {
    options: Array<OptionType>;
    name?: string;
    type?: 'radio' | 'checkbox';
    title?: string;
    checked?: string | number;
    onChange?: (data: InlineSelectChangeDataType) => void;
};

function InlineSelect({options, name: _name, title, checked, type = 'checkbox', onChange}: InlineSelectPropType) {
    const name = _name ?? (Math.random() * Date.now()).toString();
    const handleChange = (e: any,data: OptionType) => {
        const target = {...data, checked: e.target.checked };
        if (typeof onChange === 'function') {
            onChange({ target, selection: options.map((opt) => {
                if (target.value?.toString() === opt.value?.toString()) return target;
                return type === 'radio' ? { ...opt, checked: false } : opt;
            })});
        }
    }
    return options.length > 0 ? (
        <fieldset className="inline-select-fieldset">
            {
                title ? <legend>{title}</legend> : null
            }
            <div className="options-container">
                {
                    options.map(opt => (
                        <label title={opt.description} key={opt.value}>
                            <input onChange={(e) => handleChange(e, opt)} name={name} type={type} defaultChecked={opt.checked} />
                            {opt.label}
                        </label>
                    ))
                }
            </div>
        </fieldset>
    ) : null;
}
export default InlineSelect;
