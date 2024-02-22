import { useTranslation } from "react-i18next";
import LinkedInIcon from "../../../../ui-components/icons/LinkedIn.icon";
import Input from "../../../../ui-components/input/input";
import { StepsPropsType } from "./types";

const ContactStep = ({ onChange, data, errors }: StepsPropsType) => {
    const { t } = useTranslation();

    const handleChange = (e: any) => {
        if(onChange && e?.target) onChange({ [e.target.name]: e.target.value });
    };

    return (
        <div className="sign_form-container">
            <div style={{ color: '#E33F1A', fontSize: 12 }}>{t('required-info')}</div>
            <Input
                containerClassName="input-compact"
                required
                type={"text"}
                name="phone"
                title={t('phone')}
                onChange={handleChange}
                hasError={typeof errors?.phone === 'string' && errors.phone !== ''}
                errorMsg={errors?.phone}
                value={data?.phone ?? ''}
            />
            <Input
                type={"text"}
                name="phoneFixed"
                title={t('fixed-phone')}
                onChange={handleChange}
                hasError={typeof errors?.phoneFixed === 'string' && errors.phoneFixed !== ''}
                errorMsg={errors?.phoneFixed}
                value={data?.phoneFixed ?? ''}
            />
            <Input
                type={"text"}
                name="portfolioUrl"
                title={t('linkedin-link')}
                onChange={handleChange}
                hasError={typeof errors?.portfolioUrl === 'string' && errors.portfolioUrl !== ''}
                errorMsg={errors?.portfolioUrl}
                value={data?.portfolioUrl ?? ''}
                icon={
                   <LinkedInIcon style={{ marginRight: 10 }} />
                }
            />
        </div>
    )
};

export default ContactStep;
