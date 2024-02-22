import { ReactChild } from "react"

export interface HeaderRowProps {
    children: ReactChild | ReactChild[];
    [key: string]: any;
};

const HeaderRow = ({ children, ...props }: HeaderRowProps) => <tr {...props}>{children}</tr>

export default HeaderRow;
