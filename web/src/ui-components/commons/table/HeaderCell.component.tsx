import { HTMLProps, ReactChild } from "react"

export type HeaderCellProps = {
    children: ReactChild | ReactChild[];
} & Partial<HTMLProps<HTMLTableCellElement>>;

const HeaderCell = ({ children, ...props }: HeaderCellProps) => <div {...props}>{children}</div>

export default HeaderCell;
