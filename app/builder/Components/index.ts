import {   DefaultComponentProps } from "../types";
import { Fields } from "../types";


export type Component<
    FieldProps extends DefaultComponentProps = DefaultComponentProps
> = {
    label?: string;
    defaultProps: FieldProps;
    fields?: Fields<FieldProps>;
    reactComponent: React.FC<FieldProps>;
}

