import { useTranslation } from "react-i18next";
import ArchitectureIcon from "../../../../ui-components/icons/Architecture.icon";
import Input from "../../../../ui-components/input/input";
import { CreateOrgPropsType } from "./types";

const CreateOrgStep = ({ onChange, data, errors }: CreateOrgPropsType) => {
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
                type="text"
                name="corporateName"
                title={t('corporate-name')}
                onChange={handleChange}
                hasError={typeof errors?.corporateName === 'string' && errors.corporateName !== ''}
                errorMsg={errors?.corporateName}
                value={data?.corporateName ?? ''}
            />
            <Input
                type="text"
                name="picture"
                title={t('logo')}
                onChange={handleChange}
                hasError={typeof errors?.picture === 'string' && errors.picture !== ''}
                errorMsg={errors?.picture}
                value={data?.picture ?? ''}
                icon={
                    data?.picture
                    ? <img src={data?.picture} alt={data?.corporateName ?? ''} style={{ width: 35, height: 35, objectFit: 'cover', objectPosition: 'center', borderRadius: '50%', marginRight: 10 }}/>
                    : <ArchitectureIcon style={{ position: 'absolute', transform: 'scale(5)', top: 35, left: 10 }} />}
            />
            <Input
                type="text"
                name="sector"
                title={t('activity-sector-code')}
                onChange={handleChange}
                hasError={typeof errors?.sector === 'string' && errors.sector !== ''}
                errorMsg={errors?.sector}
                value={data?.sector ?? ''}
            />
            <Input
                type={"text"}
                name="legalStructure"
                title={t('legal-structure')}
                onChange={handleChange}
                hasError={typeof errors?.legalStructure === 'string' && errors.legalStructure !== ''}
                errorMsg={errors?.legalStructure}
                value={data?.legalStructure ?? ''}
            />
            <Input
                type={"text"}
                name="address"
                title={t('street-address-n-number')}
                onChange={handleChange}
                hasError={typeof errors?.address === 'string' && errors.address !== ''}
                errorMsg={errors?.address}
                value={data?.address ?? ''}
            />
            <Input
                type="text"
                name="postalCode"
                title={t('postal-code')}
                onChange={handleChange}
                hasError={typeof errors?.postalCode === 'string' && errors.postalCode !== ''}
                errorMsg={errors?.postalCode}
                value={data?.postalCode ?? ''}
            />
            <Input
                type="text"
                name="town"
                title={t('city')}
                onChange={handleChange}
                hasError={typeof errors?.town === 'string' && errors.town !== ''}
                errorMsg={errors?.town}
                value={data?.town ?? ''}
            />
            <Input
                type="text"
                name="region"
                title={t('region')}
                onChange={handleChange}
                hasError={typeof errors?.region === 'string' && errors.region !== ''}
                errorMsg={errors?.region}
                value={data?.region ?? ''}
            />
            <Input
                type="text"
                name="country"
                title={t('country')}
                onChange={handleChange}
                hasError={typeof errors?.country === 'string' && errors.country !== ''}
                errorMsg={errors?.country}
                value={data?.country ?? ''}
            />
        </div>
    )
};

export default CreateOrgStep;
