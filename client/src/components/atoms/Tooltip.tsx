import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import React, { FunctionComponent } from 'react'

interface Props {
    tooltipText: string
}


const Tooltipz: FunctionComponent<Props> = (props: Props) => {
    
    const renderTooltip = (p: Record<string, unknown>) => {
        return <Tooltip id='button-tooltip' {... p} >
            {props.tooltipText}
        </Tooltip>

    }

    return (
        <div>

        <h1>hi this is pregnancy centre</h1>
        <p>wow</p>
        <OverlayTrigger placement="right-end" overlay={renderTooltip} trigger='click'>
            <span className="tooltip-trigger"><i className="bi bi-question-circle"></i></span>
        </OverlayTrigger>
        </div> 
    )
}

export default Tooltipz;
