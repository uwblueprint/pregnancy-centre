import React, { FunctionComponent } from 'react'

interface Props {
    formItemName: string;
    errorString: string;
    isDisabled: boolean;
    onInputChange: () => void;
    tooltipText?: string;
}
const FormItem: FunctionComponent<Props> = (props: Props) => {
    return (
        <h1>
            this is formitem
        </h1>
    )
}

export default FormItem
